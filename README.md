# righto-website

The website for **Righto: Leave On Time** (iPhone), live at https://heyrighto.app.
Plain static HTML hosted on GitHub Pages. No build step, no tracking, no cookies, nothing loaded from other sites.

| Path | What it is |
|---|---|
| `/` | Home: what Righto does, App Store button |
| `/privacy/` | Privacy policy (App Store "Privacy Policy URL") |
| `/support/` | Help + contact (App Store "Support URL") |
| `/t` | Share-link landing page, shown only when Righto isn't installed |
| `/.well-known/apple-app-site-association` | Universal links: `/t` opens Righto (team M2MCF8UYF7, bundle com.roberteaves.LeaveOnTime) |

`.nojekyll` keeps GitHub Pages from hiding `.well-known`. `CNAME` sets the custom domain.
Fonts: Nunito (SIL Open Font License, `assets/fonts/OFL.txt`), served from this site.

## Share link format (v1)

The app builds links like:

```
https://heyrighto.app/t#v=1&n=Bluewater&a=Bluewater%2C+Greenhithe+DA9+9ST&lat=51.4386&lon=0.2700&at=2026-11-21T10:00%2B00:00&tz=Europe%2FLondon&by=Robert&note=Meet+by+John+Lewis
```

Everything after `#` is form-encoded (URLSearchParams). It is never sent to any server.

| Key | Required | Meaning | Limit / check |
|---|---|---|---|
| `v` | yes | Format version, `1` | unknown version = refuse |
| `n` | yes | Place name | 1 to 100 characters |
| `a` | no | Address | up to 200 characters |
| `lat`, `lon` | yes | Map position | -90..90, -180..180 |
| `at` | yes | Arrive-by, ISO 8601 with offset, e.g. `2026-11-21T10:00+00:00` | must parse |
| `tz` | no | IANA time zone of the place, e.g. `Europe/London` | ignored if unknown |
| `by` | no | Sender's first name | up to 40 characters |
| `note` | no | Short note | up to 140 characters |
| `m` | no | `transit` for a train or bus trip | other values ignored |

Never in a link: the sender's home, Leaving from, leave time, route or history.
The app and this page must refuse anything outside these limits ("This link doesn't look right. Ask them to share it again.").
