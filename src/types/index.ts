import { Tables } from './supabase';

export type ActorName = Tables<'actors'>['name'];
export type Movie = Omit<Tables<'movies'>, 'cast' | 'movieId'>;
