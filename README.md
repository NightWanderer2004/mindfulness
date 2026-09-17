## Overview

Mindfulness is a small WXT / React browser extension with one job: make it easier to actually start a pause. No separate app to open — the new tab becomes a quiet landscape, time stays visible, and theme, sound, timer, and breathing settings are one click away.

Three surfaces make up the product: a new tab experience, a compact popup, and a fullscreen session page. Pick a mood, pick a sound, hit Relax Now, breathe with the sphere, go back to whatever you were doing.

## My Impact

I built this solo. The hard part wasn't the code — it was keeping something "calming" from turning into something slow or overdesigned. I did the interaction model, the visual system, the extension architecture, the shared components, the state layer, and the session logic itself: audio playback, timer, breathing animation, theme switching, end-of-session states.

## Design & Flows

The new tab shows date and time. Controls sit in a corner, the background sets mood without getting in the way.

Sound design: extension has ambient waves, nature sounds, and mono noise. Select what you feel more comfortable.

Breathing pattern: equal, relaxing, square, calming. Extension supports custom patterns. You can set them in settings.

### New Tab Home

The new tab is the main ambient surface of Mindfulness. It keeps the browser useful - date, time, and quick controls stay visible - but replaces the usual empty tab with a calm illustrated landscape. The three controls in the corner cover the whole loop: start a session, change the mood, or adjust breathing settings.

<img width="1226" height="800" alt="tab" src="https://github.com/user-attachments/assets/ef9d8a4a-ce74-4a8c-89cc-2bc323b50e52" />

<img width="1226" height="800" alt="themes" src="https://github.com/user-attachments/assets/e79c358e-b0b4-405e-81ba-77a9e6b824f7" />

<img width="1226" height="800" alt="settings" src="https://github.com/user-attachments/assets/f31d01ba-8b83-40f1-bc51-c17eb48ee79f" />


### Popup

The popup is a compact version of the same system. It gives quick access to Session, Themes, and Settings without opening the new tab page.

I kept the layout intentionally large and tactile: one primary action, two secondary actions, and icon-led controls that are easy to recognize at extension-popup size.

<img width="337" height="353" alt="popup" src="https://github.com/user-attachments/assets/56b95ebc-9bca-44bb-b846-47a41356ed2b" />

### Theme Picker

Theme selection appears in both the popup and the new tab, but the component stays the same. Each option combines a color, icon, label, and selected state, so the user can scan the available moods quickly.

The modal uses soft contrast and large hit areas to keep the interaction calm.

<img width="337" height="353" alt="popup-themes" src="https://github.com/user-attachments/assets/1e1a36e3-0d39-4b7b-8adf-a98698b16820" />

### Sound Picker

Sound selection follows the same modal pattern as themes. Instead of exposing tracks or audio files, Mindfulness groups sound into three simple types: Ambient, Nature, and Mono.

This keeps the decision lightweight and makes sound feel like part of the system.

<img width="337" height="353" alt="popup-sounds" src="https://github.com/user-attachments/assets/70c1e404-fe6b-43fd-94c8-aa6e96d71e9f" />


### Session Screen

The background, sphere, sound, and timer all respond to the selected theme. Breathe with the animated center point, pause or resume if needed, and let the timer close the session. Screenshots show theme variation.

<img width="1226" height="800" alt="session-1" src="https://github.com/user-attachments/assets/7098fc34-5c56-4c74-a585-fb4eba5db9bf" />

<img width="1226" height="800" alt="session-2" src="https://github.com/user-attachments/assets/6a5531bc-dde0-4a01-a5f6-5ba6f92297ab" />

## Interface And Implementation

Built with React, Tailwind, Framer Motion, and WXT, plus a shared component package. A Zustand-based store persists theme, sound, timer, and breathing choice across popup, new tab, and session view.

The session page loads a theme-specific background, animates the breathing sphere according to breathing pattern, keeps controls out of the way at the bottom. Near the end of a timer, sound fades down and the breathing animation expands to fill screen in sync.

Structurally it's a small monorepo — the extension app holds the WXT entrypoints, shared UI lives in its own package. That's what kept popup, new tab, and session page visually consistent without three copies of the same button component.

## Outcome

It’s a toy. No account, no feed, no meditation library to dig through. One click, and you're in a session matched to the mood, sound, and breathing rhythm you picked giving the actual pause room to breathe and relax.
