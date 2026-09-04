# Replicate Kun Chen's FirstMate + Herdr + Pi setup

This guide recreates the public workflow Kun demonstrated in the podcast:

```text
you -> Pi running as FirstMate -> Herdr tabs -> Pi crewmates -> isolated worktrees
```

The end result is one normal directory, `~/kun-agent-workspace`. Start Herdr
there, run Pi in its first pane, and Pi becomes the FirstMate coordinator because
it reads the cloned repository's `AGENTS.md` instructions and extensions.

> Scope: macOS or Linux. Herdr's stable releases support both. Windows support
> is preview-only; use WSL if you want a Linux setup on Windows.

## What each part does

| Tool | Job |
|---|---|
| [FirstMate](https://github.com/kunchenguid/firstmate) | The coordinator instructions, skills, scripts, and local state |
| [Pi](https://pi.dev/docs/latest) | The coding-agent harness that runs FirstMate and its crewmates |
| [Herdr](https://herdr.dev/docs/) | Persistent terminal workspaces, tabs, panes, and agent status |
| [Treehouse](https://github.com/kunchenguid/treehouse) | A clean Git worktree for every parallel task |
| [No Mistakes](https://github.com/kunchenguid/no-mistakes) | Optional review, test, PR, and CI gate |
| AXI tools | Agent-friendly GitHub, browser, visual-review, task, and quota commands |

WezTerm is optional. Kun uses it as his terminal emulator, but Herdr works in any
modern terminal.

## 1. Install the basic system tools

You need Git, GitHub CLI, `jq`, `curl`, Node.js LTS, and npm.

### macOS with Homebrew

Install [Homebrew](https://brew.sh/) first if `brew` is not already available,
then run:

```sh
brew install git gh jq node
```

### Linux

Install Git, GitHub CLI, `jq`, `curl`, and the current Node.js LTS release using
your distribution's package manager. Official links:

- [GitHub CLI installation](https://github.com/cli/cli/blob/trunk/docs/install_linux.md)
- [Node.js downloads](https://nodejs.org/en/download)

For Debian or Ubuntu, the basic packages are:

```sh
sudo apt update
sudo apt install -y git jq curl ca-certificates
```

Install `gh` and Node.js LTS from the official links above if your distribution
does not provide current versions.

### Keep user-installed commands out of `sudo`

The installers below use `~/.local/bin`. Make sure that directory is on `PATH`:

```sh
mkdir -p "$HOME/.local/bin"
export PATH="$HOME/.local/bin:$PATH"
```

Make that permanent by adding the export line to `~/.zshrc` if you use Zsh or
`~/.bashrc` if you use Bash. Open a new terminal afterward.

Tell npm to use the same user-owned location. Do not run global npm installs
with `sudo`:

```sh
npm config set prefix "$HOME/.local"
```

## 2. Install Pi and Herdr

Install the current Pi package used by FirstMate:

```sh
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Install the current stable Herdr binary:

```sh
curl -fsSL https://herdr.dev/install.sh | sh
```

Install Herdr's Pi integration. This is what lets the Herdr sidebar show whether
Pi is working, blocked, or done:

```sh
herdr integration install pi
```

## 3. Install FirstMate's supporting tools

Treehouse gives each crewmate an isolated worktree, so parallel agents do not
edit the same checkout:

```sh
curl -fsSL https://kunchenguid.github.io/treehouse/install.sh | sh
```

No Mistakes provides the optional validation and PR gate:

```sh
curl -fsSL https://raw.githubusercontent.com/kunchenguid/no-mistakes/main/docs/install.sh | sh
```

Install the agent-friendly helper commands required by FirstMate's bootstrap:

```sh
npm install -g gh-axi chrome-devtools-axi lavish-axi tasks-axi quota-axi

gh-axi setup hooks
chrome-devtools-axi setup hooks
lavish-axi setup hooks
```

## 4. Create the one directory you will launch from

Clone FirstMate directly into a clearly named workspace:

```sh
git clone https://github.com/kunchenguid/firstmate.git "$HOME/kun-agent-workspace"
cd "$HOME/kun-agent-workspace"
mkdir -p config
printf 'herdr\n' > config/backend
printf 'pi\n' > config/crew-harness
```

The two files in `config/` are local and Git-ignored. They make Herdr the session
backend and Pi the default crewmate harness.

Use a name such as `kun-agent-workspace`, not exactly `firstmate`. FirstMate
reserves the Herdr workspace label `firstmate` for its own crew; a different
directory name avoids an unnecessary label collision.

## 5. Authenticate GitHub

```sh
gh auth login
gh auth status
```

Choose GitHub.com, then HTTPS or SSH according to your normal Git setup. Browser
login is easiest for most people.

## 6. Verify everything before launch

Run this from a normal terminal:

```sh
command -v git gh jq node npm pi herdr treehouse no-mistakes \
  gh-axi chrome-devtools-axi lavish-axi tasks-axi quota-axi

pi --version
herdr --version
herdr status --json | jq '{version: .client.version, protocol: .client.protocol}'
herdr integration status
treehouse --version
no-mistakes --version
gh auth status
```

Every `command -v` entry should print a path. The Herdr integration report should
show Pi as installed. FirstMate currently requires Herdr protocol 14 or newer.

## 7. Launch the setup

From now on, this is the host-terminal entry point:

```sh
cd "$HOME/kun-agent-workspace"
herdr
```

On Herdr's first launch, complete its short onboarding flow. In the initial
Herdr pane, run:

```sh
pi
```

On Pi's first launch:

1. Approve trust for `~/kun-agent-workspace`. This allows the repository's two
   tracked `.pi/extensions/*.ts` files to load.
2. Type `/login` in Pi.
3. Choose the model provider covered by your subscription, such as ChatGPT,
   Claude, or GitHub Copilot, and finish authentication.

Then send this first message to Pi:

```text
Ahoy. Run the FirstMate session startup, verify the complete toolchain, and
report anything still missing. Use Herdr as the crew backend. Ask before
installing or changing anything.
```

Pi is now the FirstMate coordinator. You talk to this one session; it delegates
long tasks to crewmates in separate Herdr tabs and Treehouse worktrees.

## 8. Give it a first project

Start safely with local-only mode so nothing is pushed or merged automatically:

```text
Add https://github.com/OWNER/REPOSITORY as a project in local-only mode. Inspect
it and report what you find. Do not change anything yet.
```

After you trust the workflow, ask FirstMate to use `direct-PR` mode or initialize
No Mistakes for the full review-and-CI gate. Do not start with the optional
`+yolo` mode.

## Daily use

Attach or reattach from the same directory:

```sh
cd "$HOME/kun-agent-workspace"
herdr
```

- If the existing Pi screen appears, continue talking to it. Do not start a
  second coordinator.
- If the pane is only a shell because Pi exited, run `pi -c` to continue the
  latest session.
- Detach without stopping the agents by pressing `Ctrl-b`, then `q`.
- Reattach later by running `herdr` again from the workspace directory.
- In Herdr, `Ctrl-b w` opens workspace navigation, `Ctrl-b g` opens the agent
  navigator, and `Ctrl-b 1` through `9` switch tabs.

Closing or detaching the terminal does not stop the Herdr server or the agents
inside it. Do not run `herdr server stop` unless you intend to stop those pane
processes.

## Updates

Update one layer at a time, then verify it before updating the next:

```sh
cd "$HOME/kun-agent-workspace"
git pull --ff-only
pi update --self
herdr update
treehouse update
no-mistakes update
npm update -g gh-axi chrome-devtools-axi lavish-axi tasks-axi quota-axi
```

After a Herdr update, refresh its Pi integration in case the integration changed:

```sh
herdr integration install pi
```

## Fast troubleshooting

### `command not found`

Open a new terminal and confirm this line is in your shell configuration:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

### Pi did not load the FirstMate extensions

Inside Pi, run `/trust`, approve the project, then quit and restart Pi from
`~/kun-agent-workspace`.

### FirstMate reports a missing tool

Let it show the exact install command, review that command, approve it, then ask
it to rerun session startup. FirstMate's bootstrap is designed to detect missing
or incompatible dependencies.

### Herdr does not show Pi's agent status

```sh
herdr integration install pi
herdr integration status
```

Restart Pi afterward.

### Security boundary

Pi and its extensions run with your user account's filesystem and process
permissions. Use a dedicated OS user, container, or sandbox if you do not want
agents to have your normal account's access. Never paste secrets into chat;
authenticate through the provider and GitHub login flows instead.

---

Last verified against the public FirstMate, Pi, and Herdr documentation on
2026-07-15. These projects move quickly, so prefer their current official
installers and re-run the verification section after updates.
