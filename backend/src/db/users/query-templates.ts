export const selectUsersTemplate = `
SELECT u.id, u.name, u.username, u.email, u.phone, a.street, a.state, a.city, a.zipcode
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
ORDER BY u.name
LIMIT ?, ?
`;

export const selectCountOfUsersTemplate = `
SELECT COUNT(*) as count
FROM users
`;

export const selectUserTemplate = `
SELECT u.id, u.name, u.username, u.email, u.phone, a.street, a.state, a.city, a.zipcode
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
WHERE u.id = ?
`;
