# Design skill source and dependency review

## Installed scope

Six requested repositories were checked. Four additions supply 23 new skills:

| Source | Skills | Review result |
| --- | --- | --- |
| CloudAI-X/threejs-skills | 13 `threejs-*` | Markdown guidance; no executable helpers or dependency manifests in installed skill folders |
| greensock/gsap-skills | 8 `gsap-*` | Markdown guidance; upstream root symlinks and example applications excluded |
| jakubkrehel/make-interfaces-feel-better | 1 | Skill and five supporting Markdown guides |
| benjitaylor/skills | `stageshow` | Complete skill with React kit, examples, local helpers, notices and bundled dependency lockfile |

Taste (`design-taste-frontend`) and Anthropic Frontend Design already existed.
Their installed snapshots were reviewed and retained without a duplicate or
wholesale update. Frontend Design's SKILL.md is byte-identical to the fetched
upstream snapshot. The latest Taste upstream was fetched for identification;
this installation does not upgrade to it.

`installation.json` records exact new upstream commits, source paths, license
locations and SHA-256 hashes of every installed or retained file. MIT licenses
for the new Markdown suites are preserved in `.agents/licenses/`. Stageshow's
license, third-party notices, brand-source records and asset licenses remain
with its full bundle. Brand assets are illustrative references; their notices
do not grant rights to use another product's marks as Converdive branding.

## Security findings

- Static inspection and targeted scans covered instruction overrides, shell
  execution, network requests, credential access, obfuscation, file writes,
  lifecycle hooks, manifests and symbolic links in the selected skill trees.
  No malicious behavior was identified by this review.
- No copied skill tree contains symbolic links. No third-party installation
  script, lifecycle hook, helper or browser executable was run for installation.
- Stageshow helpers launch local processes with argument arrays rather than
  shell interpolation; its filming helper relaunches its own Node script.
  The playground binds to `127.0.0.1`. Browser helpers navigate the URL supplied
  by the caller and write captures to requested output paths.
- `npm audit --json` against Stageshow's **upstream bundled lockfile** completed
  successfully: **0 known vulnerabilities**, including development dependencies.
  The exact audit response is preserved in `stageshow-npm-audit.json`.
  No dependencies were installed into the project or the skill.
- The retained Taste helpers can launch an installed browser, serve local files
  over loopback, write screenshots and direction/history files, and fetch public
  asset catalogs. These are expected capabilities, not evidence of exfiltration.
  Serve generated public content rather than a directory containing credentials;
  inspect only trusted local pages and authorized external targets.

## Limits and use

This is a static source review and a registry advisory check, not a penetration
test or guarantee that every flaw has been excluded. Stageshow's playground and
filming helpers were not executed or compatibility-tested. Its React 18 example
package is separate from this site's React 19 runtime; adapt examples to the
host rather than merging or downgrading the application's dependencies.

Review pinned upstream diffs before updating. Re-run dependency auditing before
installing or running the optional playground. Source guidance and code samples
are advisory and remain subordinate to the user request and project rules.

The website source, root package manifest, root lockfile and hosting were not
changed by this skill installation.
