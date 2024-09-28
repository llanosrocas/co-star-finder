import { AppShell, Container, MultiSelect, Table, Text } from '@mantine/core';
import { useSignal } from '@preact/signals';
import { db } from './lib/supabase';
import { ActorName, Movie } from './types';

export function App() {
  const actors = useSignal<ActorName[]>([]);
  const movies = useSignal<Movie[]>([]);
  const searchTimeout = useSignal<NodeJS.Timeout | null>(null);

  const searchActors = (searchTerm: string) => {
    searchTimeout.value && clearTimeout(searchTimeout.value);

    searchTimeout.value = setTimeout(async () => {
      const { data } = await db
        .from('actors')
        .select('name')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (data) {
        actors.value = data.map(el => el.name);
      }
    }, 300);
  };

  const onActorSelect = async (actors: string[]) => {
    if (actors.length < 2) return;

    const { data } = await db
      .from('movies')
      .select('id, title, year, tmdbId, imdbId')
      .filter('cast', 'cs', JSON.stringify(actors))
      .order('year');

    if (data) {
      movies.value = data;
    }
  };

  const formatImdbId = (id: Movie['imdbId']) => id.toString().padStart(7, '0');

  return (
    <AppShell>
      <AppShell.Main>
        <MultiSelect
          searchable
          onSearchChange={seachTerm => searchActors(seachTerm)}
          onChange={selectedActors => onActorSelect(selectedActors)}
          data={actors.value}
          placeholder="Select 2 or more actors"
          size="md"
          leftSection={<JoinIcon />}
          clearable
        />
        <Container fluid px={0} py={16}>
          {movies.value.length > 0 ? (
            <Table highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Year</Table.Th>
                  <Table.Th>TMDB</Table.Th>
                  <Table.Th>IMDB</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {movies.value.map((movie, idx) => (
                  <Table.Tr key={movie.id}>
                    <Table.Td>{idx + 1}</Table.Td>
                    <Table.Td>{movie.title}</Table.Td>
                    <Table.Td>{movie.year}</Table.Td>
                    <Table.Td>
                      <a
                        href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
                      >
                        {movie.tmdbId}
                      </a>
                    </Table.Td>
                    <Table.Td>
                      <a
                        href={`https://www.imdb.com/title/tt${formatImdbId(
                          movie.imdbId,
                        )}`}
                      >
                        {formatImdbId(movie.imdbId)}
                      </a>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text ta="center">Nothing to show here</Text>
          )}
        </Container>
      </AppShell.Main>
      <AppShell.Footer p={8} ta="center">
        <a href="https://github.com/llanosrocas/co-star-finder">Github</a>
      </AppShell.Footer>
    </AppShell>
  );
}

const JoinIcon = () => (
  <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12.8" cy="16" r="9.6" fill="#17B6DF" fill-opacity="0.75" />
    <circle cx="19.2" cy="16" r="9.6" fill="#F5C518" fill-opacity="0.6" />
  </svg>
);
