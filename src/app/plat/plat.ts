/* Defines the customer entity */
import {Restaurant} from '../restaurant/restaurant'
export interface Plat {
  id: number;
  name: string;
  description: string;
  price: number;
  image: Blob[];
  restaurant: Restaurant;
}
