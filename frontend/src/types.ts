export interface User {
  user: string;
  name: string;
  id_: string;
  is_admin: boolean;
}

export interface UserSubscriptions {
  subscriptions: User[];
}

export interface UserSubscribers {
  subscribers: User[];
}

export interface IPost {
  id_: string;
  title: string;
  user_id: string;
  content: string;
  user: User;
  posted_at: number;
  views: number;
}

export interface SearchResults extends User {
  is_subscribed: boolean;
  is_subscribed_to_me: boolean;
}
