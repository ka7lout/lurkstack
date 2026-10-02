/** Presentation data contracts shared by the Arena-derived UI components. */

export interface UserView {
  id: string;
  name: string;
  handle: string;
  bio: string;
  /** ISO 8601 */
  joinedAt: string;
}

export interface SessionUserView {
  id: string;
  name: string;
  handle: string;
  email: string;
}

export interface PostView {
  id: string;
  authorId: string;
  author: UserView;
  content: string;
  createdAt: string;
  editedAt?: string;
  likeCount: number;
  viewerHasLiked: boolean;
  commentCount: number;
}

export interface CommentView {
  id: string;
  postId: string;
  authorId: string;
  author: UserView;
  content: string;
  createdAt: string;
}

export const POST_MAX_LENGTH = 280;
export const COMMENT_MAX_LENGTH = 280;
