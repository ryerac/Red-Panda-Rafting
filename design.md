# Red Panda Rafting — Design Direction

This is the living reference for the game's look, feel, goals, and rules. Use it when adding content, changing visuals, or deciding whether a feature belongs in the game. Setup and maintenance instructions live in [README.md](README.md).

The current baseline below describes the implementation as of 27 September 2026. Future ideas are proposals, not completed features. Update these distinctions as the game evolves.

## The promise

**A little raft. A big good deed.**

The player is a red panda travelling downstream through a colourful woodland. They can enjoy the river, gather berries, or pull over to help a friend. Small acts of kindness are the main source of score and the emotional centre of the game.

A run should feel like a short outing: a gentle beginning, a little adventure, and a welcoming campsite at the end. Target roughly ten minutes of active play for the first river, with future expansion toward fifteen. Dialogue and pause time should not create pressure.

The recurring decision is: **“Do I play it safe, or go over there because something interesting is happening?”**

## Goals and principles

- **Enjoyable movement first.** Steering, paddling, and drifting should be satisfying even without an active task.
- **Kindness drives the adventure.** Helping characters should be rewarding, visible, and easy to understand.
- **Small, frequent choices.** Offer approachable decisions about routes, berries, hazards, and accepting another task.
- **Forgiving consequences.** Mistakes cost points or opportunities without repeatedly ending the outing.
- **Readable at a glance.** Clear silhouettes, markers, brief dialogue, and a compact task list keep attention on the river.
- **A complete small game.** Prioritise a polished journey from menu to campsite over numerous unfinished systems.
- **Easy to share and maintain.** Keep the game browser-only, self-contained, and based on predefined content.

Success means a new player understands the controls during the opening minute, recognises a safe landing, completes a favour, recovers from mistakes, and finishes wanting another run.

## Overall look

### World and perspective

Use a 2D top-down or slightly angled top-down view. The raft stays around the lower-middle of the play area so the player can see opportunities ahead. The environment scrolls downward as the raft progresses downstream.

The woodland should feel illustrated, chunky, warm, and playful. Use rounded tree canopies, simple rocks, wooden landings, soft water marks, and recognisable animal silhouettes. Detail should support navigation and charm without obscuring the play space.

Current artwork is drawn in Canvas. More elaborate art is optional: consistent shapes, colours, and animation matter more than expensive assets.

### Palette

These are starting points from the current implementation rather than restrictions on every future asset.

| Role | Colour | Purpose |
| --- | --- | --- |
| Deep woodland green | `#183b34` | Text and strong interface contrast |
| Warm cream | `#f8f5e9` | Cards, dialogue, and welcoming surfaces |
| River teal | `#70a99b` | Calm water and the main playfield |
| Leaf green | `#c7d3a2` | Banks and open woodland |
| Terracotta | `#bd5d37` | Primary actions and warm emphasis |
| Panda orange | `#c66837` | Player recognition and warmth |
| Sand | `#e2d4a4` | Shorelines and separation of land and water |

Keep obstacles distinct from water, interactions distinct from decoration, and the panda easy to find. Objectives should use markers, words, and shapes as well as colour.

### Typography and interface

Use a storybook-style serif for large headings and a readable sans serif for controls, dialogue, and scores. The current stylesheet names preferred fonts with local fallbacks; no fonts are downloaded at runtime. Preserve offline operation and readability when changing typography.

Keep cream panels, rounded corners, generous spacing, restrained shadows, and warm primary buttons. The menu introduces the panda and the tone immediately. During play, keep the river centre open: status on the left, score and tasks on the right, journey progress below.

The HUD should answer: How am I doing? What am I carrying? Where do I need to go? It should not turn play into inventory management.

## Feel and sound

The raft should have a little inertia and turn gently into steering. Braking gives time to approach a landing without stopping the current. Paddling should feel active through movement, paddle animation, and water feedback.

Bobbing, wake lines, waving shore characters, bouncing markers, and score popups make simple artwork feel alive. Collision feedback should be noticeable without feeling aggressive. Future polish can add richer splashes, leaves, birds, and more expressive character reactions.

Audio should be light: river ambience, soft paddle sounds, a clear collision cue, berry notes, task cues, and a short upbeat musical pattern. The baseline uses synthesised audio and starts muted. Sound must remain optional and must never be the only way to understand an event.

## Core loop

Navigate → spot an opportunity → choose whether to stop → accept a task → continue downstream → complete it → earn points → choose the next opportunity.

Stopping is always optional. A player who ignores every character should still be able to finish and enjoy the river. Tasks add purpose and scoring opportunities without becoming gates to progression.

## Current gameplay baseline

### Navigation and tasks

Arrow keys steer, paddle, and brake. Space docks at nearby characters or retrieves marked lost items. Enter accepts or completes dialogue; Space declines or leaves it. Dialogue stops travel. Escape pauses and resumes, including an open conversation. Berries collect on contact.

Mouse control is an equally supported desktop option. The raft follows the pointer horizontally with the same momentum and speed limit as keyboard steering. Three small floating buttons sit behind the raft: Slow, Normal, and Paddle. Each has an icon, a short label, and a clear selected state. They follow the raft but hold still while hovered so they remain easy to click.

Hovering an available animal changes the cursor to a hand and brightens a glowing, animated dashed ring around its clickable area. Clicking selects the landing: the raft steers toward it, slows on approach, and opens dialogue within normal docking range. The ring remains highlighted during approach. Moving the pointer again or using an arrow key cancels it. This assistance does not teleport the raft, avoid obstacles, or bypass river forks.

Nearby lost items and dialogue choices can also be clicked. Pointer movement over menus does not steer. Pause and docking clear mouse steering and restore normal pace. Keyboard controls remain available, with arrow keys taking priority until the pointer moves again.

The raft can carry up to three active tasks. There are currently nine authored offers across four types:

| Type | Player action | Key rule |
| --- | --- | --- |
| Parcel delivery | Accept cargo and meet a downstream recipient | Destination must remain reachable after acceptance |
| Lost item | Find the floating object and press Space nearby | No return trip is required |
| Rescue | Take a passenger to a downstream destination | Passenger appears on the raft |
| Collection | Gather berries, then meet the recipient | Only berries collected after acceptance count |

Rescue passengers currently board at the requesting character's landing. Separate stranded-animal pickups are a possible extension. Passengers currently do not change handling.

Collection requests track independent progress: one berry can advance several active collection tasks. They do not consume a shared inventory.

Passed destinations fail after a short distance allowance and reset the task streak. Unfinished tasks award nothing at the campsite. Destination and branch information should make failures understandable rather than surprising.

### Bamboo speed boost

Floating bamboo is an optional movement pickup, collected on contact. It gives 50% extra target speed for 30 seconds of active rafting. A further pickup refreshes the timer to 30 seconds without stacking the speed increase. Braking and paddling still work; speed eases back to normal when the timer expires.

Pause, dialogue, and recovery freeze the timer. A new run clears it. Bamboo awards no direct points, does not count as a berry, and uses no task slot. Its benefit is faster travel, balanced against less reaction time for obstacles and landings.

Draw it as recognisable segmented green stalks with leaves and a BOOST label. Show collection feedback and a countdown at the top centre of the screen. Placement is predefined in `src/river-layout.json`; duration and multiplier are configured by `BAMBOO_BOOST` in `src/model.ts`.

### Hearts and recovery

Start with three hearts. A collision removes one and briefly grants damage immunity. Losing the third heart moves the raft to a safe position beside the current river section, restores hearts, and subtracts up to 150 points. Score cannot become negative.

This is a brief recovery at the current location, not a reload of an earlier checkpoint. Active tasks remain aboard, although missed destinations still expire. There is no mid-run game-over screen.

### Scoring

| Event | Current value |
| --- | --- |
| Berry | +10 |
| Clean obstacle stretch | +50 |
| Complete the right-hand fork | +100 |
| Task | +250 or +500 base reward |
| Consecutive completed tasks | Task multiplier progresses through ×1, ×1.25, ×1.5, ×2 |
| Collision or missed task | Reset task streak |
| Three-heart recovery | Deduct up to 150 |

The multiplier applies to task rewards only, using the streak before that completion and rounding to a whole point. River rewards are separate. These numbers can be tuned; helping friends should be attractive without making ordinary rafting feel pointless.

Results show river and task points, completed tasks, critters helped, berries, longest streak, collisions, recovery penalties, and total score. Currently each completed task counts as one critter helped. A personal best is stored locally when browser storage is available.

## River structure and pacing

| Section | Experience | Current distance range |
| --- | --- | --- |
| Gentle River | Learn movement, gather berries, meet the first friend | 0–6,500 |
| Woodland River | Overlapping tasks and a route decision | 6,500–17,000 |
| The Rapids | Faster water, a narrower channel, more demanding steering | 17,000–25,500 |
| Scenic Finish | Calmer water, final deliveries, Firefly Camp | 25,500–33,000 |

Distances are internal world units, not metres. Speed, braking, and route choice affect duration; dialogue adds real time without advancing the river. The ten-minute target is approximate rather than a countdown.

The current fork begins around 10,500 and reconnects by 15,500. A physical island divides the channels. The left route is slower and provides access to Frog's letter delivery. The right route is faster and grants a bonus.

Future layout revisions should strengthen the contrast: a calm, longer route with appealing berry trails versus a quicker route with clearly signalled hazards. Verify that contrast through playtesting rather than assuming speed alone creates a good choice.

Give players time to cross toward a landing. Keep stopping areas clear of obstacles. Place destinations far enough downstream to be practical, signal branch requirements before commitment, and leave enough river to complete final offers.

## Characters and writing

The player is always the red panda. Woodland friends include Rabbit, Beaver, Fox, Hedgehog, Otter, Duck, Frog, Badger, and Owl.

Dialogue should be warm, brief, and specific. Explain the favour, destination, and any branch requirement in a few sentences. Avoid lengthy conversations, guilt for declining, and complicated lore.

Example tone: “Oh, perfect timing! Could you take this picnic basket to Beaver? He's waiting just downstream.”

The world should suggest a small community preparing for a pleasant evening together. Firefly Camp provides a sense of arrival and belonging, not merely a score calculation.

## Technical and scope constraints

- Browser-only TypeScript, Canvas rendering, and HTML/CSS interface.
- No backend, account, multiplayer, online leaderboard, or required connection during play.
- Predefined dialogue, tasks, and obstacle/berry placements; no runtime generation of gameplay content.
- Standalone HTML must work both directly from disk and under a website subfolder.
- Extend shared task behaviour and data where possible instead of adding character-specific systems.
- Desktop mouse and keyboard play are supported. Touch and controller support require deliberate input and interface work.

Task definitions and placements are configurable, but some movement, rendering, and tuning values still live in `src/main.ts`. Extract shared configuration when future changes justify it; the current implementation is not fully data-driven.

## Future direction

These are proposals, not commitments or implemented features.

1. **Refine the current river.** Tune steering, docking windows, warning distance, berry trails, route contrast, and the opening minute through playtesting.
2. **Improve clarity and access.** Review contrast, small-screen HUD layout, keyboard focus, remappable controls, and reduced-motion options. Full accessibility and cross-browser coverage have not been established.
3. **Polish presentation.** Richer splashes, leaves and wildlife, more distinct characters, clearer carried cargo, and improved audio.
4. **Extend familiar tasks.** Fragile parcels, timed food deliveries, scenic passenger requests, landmark visits, or linked rescues. Reuse movement, pickups, and destinations wherever possible.
5. **Expand content.** More authored encounters or another river; extend toward fifteen minutes only when the added length stays interesting.
6. **Broaden input support.** Controller and touch controls that preserve the approachable movement model.

Timed or fragile tasks should be optional and clearly signalled. Later additions must preserve the forgiving tone rather than introduce constant urgency or punishment.

## Updating this document

Before a substantial change, explain its player benefit and which goal it serves. Decide whether it changes the current baseline or remains a future proposal. Update the relevant section when implementation changes.

For a proposed feature, record:

| Field | Question |
| --- | --- |
| Goal | What player experience improves? |
| Behaviour | What will the player see and do? |
| Scope | Which systems and content must change? |
| Tradeoff | What complexity, pressure, or readability cost does it introduce? |
| Validation | How will we know it feels better and still works? |
| Status | Proposed, in progress, implemented, or deferred? |

Keep the README accurate for running and maintaining the project, and this document accurate for its creative direction and rules. Automated tests protect behaviour and packaging; manual playtesting decides whether the river is enjoyable.
