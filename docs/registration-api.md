# Registration API

`POST /api/auth/register`, `Content-Type: application/json`.

```json
{
  "name": "Boris",
  "email": "boris@example.com",
  "password": "an example long passphrase"
}
```

- Name: trimmed, 1–100 characters.
- Email: trimmed and lowercased, basic format validation, maximum 254 characters.
- Password: 9–128 Unicode code points, preserved exactly (including spaces).
- Maximum JSON body: 8 KiB. Extra fields are ignored and never stored.
- Passwords use asynchronous Node.js scrypt with a random 16-byte salt and
  parameters `N=131072, r=8, p=1`. The stored format is
  `scrypt$N$r$p$saltHex$keyHex` (64-byte key; salt passed to scrypt as a hex string).
  See [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt).

Responses:

| Status | Meaning |
| --- | --- |
| 201 | Created; `{ user: { id, name, email, createdAt } }` |
| 400 | Invalid JSON or invalid fields; `{ error: string }` |
| 409 | Email already registered |
| 413 | Body exceeds the limit |
| 415 | Content-Type is not application/json |
| 500 | Generic server/database failure |

Registration creates a user but does not start a session or set cookies.
The UI is unchanged. Login, email verification, and rate limiting are not part
of this step; add abuse protection before exposing registration publicly.
Tests use an isolated in-memory collection substitute and never write to Atlas.

Run `npm run test:registration` to check validation, duplicate handling,
response privacy, failure handling, and the real password hashing function.
