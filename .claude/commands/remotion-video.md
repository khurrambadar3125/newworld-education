---
name: remotion-video
description: Generate motion graphic videos using Remotion (React-based video framework). Use for creating educational content videos, platform demos, social media clips, and promotional material.
allowed-tools: Bash(npm *) Bash(npx *) Bash(node *) Read Write Edit Glob
---

# Remotion Video Generator

Create professional motion graphic videos using Remotion — a React-based video creation framework. Videos are rendered as MP4 files.

## SETUP (first time only)

```bash
npm install remotion @remotion/cli @remotion/bundler
npx remotion --version  # verify
```

## HOW TO CREATE A VIDEO

### Step 1: Define the composition
Create a React component in `src/videos/` (or wherever specified):

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ flex: 1, background: '#080C18', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#fff', fontSize: 80, opacity }}>
        NewWorldEdu
      </h1>
    </div>
  );
};
```

### Step 2: Register the composition
Create `src/videos/Root.tsx`:

```tsx
import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}  // 5 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
  />
);
```

### Step 3: Render
```bash
npx remotion render src/videos/Root.tsx MyVideo output/my-video.mp4
```

## VIDEO TYPES FOR NEWWORLDEDU

### 1. Platform Demo (30-60 seconds)
- Show the study path flow
- Show question bank in action
- Show Starky responding
- End with CTA

### 2. Subject Explainer (15-30 seconds)
- Animated concept explanation
- Formula with step-by-step reveal
- Perfect for social media / WhatsApp sharing

### 3. Stats Animation (10 seconds)
- Animated counter: "50,000+ verified questions"
- Subject icons floating in
- Good for ads

### 4. Student Testimonial (15 seconds)
- Quote text animating in
- Star rating
- Parent name and location

## BRAND GUIDELINES
- Background: #080C18 (dark) or #FFFFFF (light)
- Primary: #4F8EF7 (blue)
- Gold accent: #C9A84C
- Font: Sora (import from Google Fonts)
- Logo: NewWorldEdu★

## RENDERING OPTIONS
```bash
# 1080p (default)
npx remotion render Root.tsx MyVideo output.mp4

# 720p (faster, smaller file)
npx remotion render Root.tsx MyVideo output.mp4 --width 1280 --height 720

# GIF (for social)
npx remotion render Root.tsx MyVideo output.gif --image-format png

# Preview in browser
npx remotion preview src/videos/Root.tsx
```

## OUTPUT
- Save videos to `~/Desktop/` or `output/`
- Name format: `newworldedu-[type]-[date].mp4`
