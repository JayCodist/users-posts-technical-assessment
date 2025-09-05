export const selectPostsTemplate = `
SELECT *
FROM posts
WHERE user_id = ?
`;

export const deletePostTemplate = `
DELETE FROM posts
WHERE id = ?
`;

export const addPostTemplate = `
INSERT INTO posts (id, title, body, user_id, created_at) VALUES (?, ?, ?, ?, ?)
`;