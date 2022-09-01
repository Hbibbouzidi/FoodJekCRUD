/* Defines the customer entity */
export interface Plat {
  id: number;
  name: string;
  description: string;
  price: number;
  image: Blob[];
  restaurant: number;
}

export type WithRestaurant = {
  restaurant: Restaurant
}

export type WithRestaurantName = {
  restaurantName: string
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  tel: string;
  email: string;
}