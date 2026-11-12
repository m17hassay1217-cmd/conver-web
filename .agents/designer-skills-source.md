# Designer Skills installation

- Source: https://github.com/Owl-Listener/designer-skills
- Pinned upstream commit: `9a6930cf84a822eb458624bd11c61aac5bbdf224`
- Installed: 111 design-practice skills from nine collections, copied from each
  `<collection>/skills/<name>/` into `.agents/skills/<name>/`.
- License: MIT; preserved in `.agents/designer-skills-LICENSE`.
- Review before installation: all 111 skill directories contain Markdown only;
  no symbolic links, executable code, package manifests, install hooks, or
  dependencies were copied. A case-insensitive scan of the skill files found
  no shell-install, credential-access, or network-fetch instructions. Skill
  names do not collide with existing local skills.
- Scope: this installs the 111 skills in the linked repository itself. The
  marketplace also refers to four separate companion repositories; those were
  not installed.
- This is a source inspection, not a guarantee against every possible future
  issue. Review upstream diffs before updating the pinned snapshot.
