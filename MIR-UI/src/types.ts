export interface Link {
  title: string;
  url: string;
  icon: string;
}

export interface LinktreeNFT {
  id: string;
  title: string;
  titleColor: string;
  backgroundColor: string;
  bio: string;
  avatarUrl: string;
  links: Link[];
  owner: string;
  username?: string;
}
