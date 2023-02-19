export interface IEvent {
  id: string;
  title: string;
  slugTitle: string;
  date: string;
  otd: string;
  description: string;
  NSFW: boolean;
  links: string[];
  tags: string[];
  imgSrc?: string;
  imgAltText?: string;
}
