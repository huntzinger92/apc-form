export interface IEvent {
  id: string;
  title: string;
  slugTitle: string;
  date: string;
  otd: string;
  category:
    | "Rebellion"
    | "Revolution"
    | "Labor"
    | "Other"
    | "Birthdays"
    | "Assassinations";
  description: string;
  NSFW: boolean;
  sources: string;
  imgSrc?: string;
  imgAltText?: string;
}
