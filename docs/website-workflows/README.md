# Workflow installation

The authenticated GitHub OAuth app lacks workflow scope. To preserve non-destructive pushes, workflow templates live here rather than .github/workflows/. With an appropriately authorized login, copy both YAML files into .github/workflows/ and commit. CI performs build/type checking. Pages deploys only on manual dispatch with PUBLISH entered; configure repository Pages source as GitHub Actions first. Do not enable publication until approved.
