# Mobile App - Arabic-First UX Design

## Design Philosophy

**Core Principle:** A driver with low literacy should be able to complete a delivery without reading a single word.

### Design Rules

1. **Icons First, Text Second**
   - Every action has a clear icon
   - Text is supplementary, not primary
   - Use universal symbols

2. **Maximum 3-4 Buttons Per Screen**
   - No complex menus
   - One primary action per screen
   - Clear visual hierarchy

3. **Large Touch Targets**
   - Minimum 80x80pt buttons
   - Generous spacing
   - Easy to tap while driving (when stopped)

4. **Color Coding**
   - Green = Go/Success
   - Red = Stop/Problem
   - Orange = Attention
   - Blue = Information

5. **Voice Over Text**
   - Voice messages instead of typing
   - Audio feedback for actions
   - Voice guidance (optional)

## Screen Designs

### 1. Home Screen

```
┌─────────────────────────────────┐
│  🚛 Marine Maroc                │
├─────────────────────────────────┤
│                                 │
│     ┌─────────────────┐        │
│     │   📦 [2]        │        │
│     │                 │        │
│     │  شحنات جديدة    │        │
│     │  (New Loads)    │        │
│     └─────────────────┘        │
│                                 │
│     ┌─────────────────┐        │
│     │   🗺️            │        │
│     │                 │        │
│     │  موقعي          │        │
│     │  (My Location)  │        │
│     └─────────────────┘        │
│                                 │
│     ┌─────────────────┐        │
│     │   💬            │        │
│     │                 │        │
│     │  رسائل          │        │
│     │  (Messages)     │        │
│     └─────────────────┘        │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Only 3 buttons
- Badge count on new loads
- Large, clear icons
- Arabic text primary, English secondary

### 2. Order Details Screen

```
┌─────────────────────────────────┐
│  ← رجوع                         │
├─────────────────────────────────┤
│                                 │
│  📍 من (From):                  │
│  🏢 الدار البيضاء               │
│                                 │
│  📍 إلى (To):                   │
│  🏢 طنجة                        │
│                                 │
│  📦 البضاعة (Cargo):            │
│  🔧 معدات ثقيلة                │
│                                 │
│  ─────────────────────────      │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ▶️  ابدأ الرحلة        │   │
│  │     (Start Trip)        │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Minimal text
- Icons for every field
- One big action button
- No scrolling needed

### 3. Active Trip Screen

```
┌─────────────────────────────────┐
│  🚛 في الطريق (On Route)        │
├─────────────────────────────────┤
│                                 │
│        [MAP VIEW]               │
│     Your location here          │
│     Destination marker          │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ⏱️ 2 ساعة (2 hours)           │
│  📍 120 كم (120 km)             │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ✅  وصلت                │   │
│  │     (I Arrived)         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🆘  مشكلة              │   │
│  │     (Problem)           │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Map as primary visual
- Large time/distance display
- Two clear actions
- Automatic GPS tracking

### 4. Proof of Delivery Screen

```
┌─────────────────────────────────┐
│  ← رجوع                         │
├─────────────────────────────────┤
│                                 │
│  إثبات التسليم                  │
│  (Proof of Delivery)            │
│                                 │
│  ┌─────────────────────────┐   │
│  │    📷                   │   │
│  │  التقط صورة              │   │
│  │  (Take Photo)           │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    ✍️                   │   │
│  │  التوقيع                │   │
│  │  (Signature)            │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ✅  تم التسليم          │   │
│  │     (Delivered)         │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- Visual instructions
- No text input
- Simple 3-step process
- Clear completion button

### 5. Voice Messages Screen

```
┌─────────────────────────────────┐
│  ← رجوع                         │
├─────────────────────────────────┤
│                                 │
│  رسائل صوتية (Voice Messages)   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🎤 المرسل               │   │
│  │  ▶️ [2:34]              │   │
│  │  منذ 5 دقائق             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🎤 المرسل               │   │
│  │  ▶️ [1:12]              │   │
│  │  منذ ساعة                │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │    🎤                   │   │
│  │  اضغط للتسجيل           │   │
│  │  (Hold to Record)       │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Features:**
- No typing required
- Hold-to-record (WhatsApp style)
- Play button for messages
- Visual waveform while recording

## Icon Library

### Primary Actions

| Icon | Arabic | English | Color | Usage |
|------|--------|---------|-------|-------|
| ▶️ | ابدأ | Start | Green | Start trip |
| ✅ | تم | Done | Green | Complete action |
| 📷 | صورة | Photo | Blue | Take photo |
| ✍️ | توقيع | Signature | Blue | Sign |
| 🎤 | صوت | Voice | Blue | Voice message |
| 🗺️ | خريطة | Map | Blue | Show map |
| 🆘 | مساعدة | Help | Red | Emergency |
| ❌ | إلغاء | Cancel | Red | Cancel |

### Status Indicators

| Icon | Arabic | English | Meaning |
|------|--------|---------|---------|
| 🟢 | متاح | Available | Ready |
| 🟡 | في الطريق | On Route | Driving |
| 🔴 | مشغول | Busy | Not available |
| ⚪ | غير متصل | Offline | No connection |

### Navigation

| Icon | Arabic | English |
|------|--------|---------|
| 🏠 | الرئيسية | Home |
| 📦 | الشحنات | Loads |
| 💬 | الرسائل | Messages |
| ⚙️ | الإعدادات | Settings |

## Component Library

### IconButton Component

```typescript
interface IconButtonProps {
  icon: string;
  labelAr: string;
  labelEn: string;
  onPress: () => void;
  color?: string;
  badge?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  labelAr,
  labelEn,
  onPress,
  color = '#0047AB',
  badge,
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    {badge && <View style={styles.badge}><Text>{badge}</Text></View>}
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.labelAr}>{labelAr}</Text>
    <Text style={styles.labelEn}>{labelEn}</Text>
  </TouchableOpacity>
);
```

### VoiceRecorder Component

```typescript
const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  
  const startRecording = async () => {
    setRecording(true);
    await AudioRecorder.start();
  };
  
  const stopRecording = async () => {
    const audioFile = await AudioRecorder.stop();
    setRecording(false);
    // Upload audio file
  };
  
  return (
    <TouchableOpacity
      onPressIn={startRecording}
      onPressOut={stopRecording}
      style={[styles.button, recording && styles.recording]}
    >
      <Text style={styles.icon}>🎤</Text>
      <Text style={styles.label}>
        {recording ? 'جاري التسجيل...' : 'اضغط للتسجيل'}
      </Text>
    </TouchableOpacity>
  );
};
```

## RTL (Right-to-Left) Support

### Configuration

```typescript
// App.tsx
import { I18nManager } from 'react-native';

// Force RTL for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
```

### Styling for RTL

```typescript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Automatically reverses in RTL
  },
  text: {
    textAlign: 'right', // Right-aligned for Arabic
    writingDirection: 'rtl',
  },
});
```

## Accessibility Features

### 1. Voice Feedback

```typescript
// Announce actions
import { AccessibilityInfo } from 'react-native';

const announceAction = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
};

// Usage
onPress={() => {
  startTrip();
  announceAction('تم بدء الرحلة'); // "Trip started"
}}
```

### 2. Haptic Feedback

```typescript
import { Vibration } from 'react-native';

const hapticFeedback = () => {
  Vibration.vibrate(50); // Short vibration
};

// On button press
onPress={() => {
  hapticFeedback();
  handleAction();
}}
```

### 3. Sound Effects

```typescript
import Sound from 'react-native-sound';

const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE);
const errorSound = new Sound('error.mp3', Sound.MAIN_BUNDLE);

// Play on action
successSound.play();
```

## Testing with Low-Literacy Users

### Usability Test Script

1. **Give driver phone with app installed**
2. **No instructions - observe**
3. **Can they:**
   - Find their assigned load? ✓
   - Start the trip? ✓
   - Navigate to destination? ✓
   - Complete delivery? ✓
   - Take photo and signature? ✓
   - Send voice message? ✓

### Success Criteria

- ✅ Complete delivery without help
- ✅ No confusion about buttons
- ✅ Prefer app over paper/phone calls
- ✅ Can use after 5-minute training

---

**This UX is our competitive advantage. Keep it simple, visual, and Arabic-first.**
