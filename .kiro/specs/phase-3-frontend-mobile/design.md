# Phase 3: Frontend & Mobile - Design Document

## Overview

This document outlines the technical design for Phase 3 of the Marine Maroc fleet management system. Phase 3 focuses on creating an Arabic-first, icon-heavy mobile app designed specifically for low-literacy drivers, along with a simplified French console for dispatchers.

**Critical Design Principle:** The mobile app must be usable by drivers who struggle with reading. Icons, colors, and voice messages are primary; text is secondary.

## Architecture

### High-Level Architecture

```
Frontend Applications (Phase 3 Focus)
├── Console (Ember.js) - French for Dispatchers
│   ├── Simplified Navigation (5 items)
│   ├── Marine Maroc Theme
│   └── French Translations
│
└── Mobile App (React Native) - Arabic for Drivers
    ├── Arabic-First Interface
    │   ├── RTL Layout
    │   ├── Large Arabic Fonts (18pt+)
    │   └── Minimal Text
    ├── Icon-Heavy Design
    │   ├── 3-4 Buttons Max Per Screen
    │   ├── Large Touch Targets (80x80pt)
    │   └── Universal Icons
    ├── Voice Message System
    │   ├── Hold-to-Record
    │   ├── No Typing Required
    │   └── Audio Playback
    └── Visual Feedback
        ├── Animations
        ├── Haptic Feedback
        └── Sound Effects
```

## Components and Interfaces

### 1. Console UI Simplification (French)

**Navigation Structure:**
```javascript
// console/app/templates/components/main-navigation.hbs
<nav class="main-navigation">
    <LinkTo @route="operations.orders" class="nav-item">
        <FaIcon @icon="box" />
        <span>Chargements</span>
    </LinkTo>
    
    <LinkTo @route="management.drivers" class="nav-item">
        <FaIcon @icon="user" />
        <span>Chauffeurs</span>
    </LinkTo>
    
    <LinkTo @route="management.vehicles" class="nav-item">
        <FaIcon @icon="truck" />
        <span>Véhicules</span>
    </LinkTo>
    
    <LinkTo @route="management.places" class="nav-item">
        <FaIcon @icon="map-marker" />
        <span>Lieux</span>
    </LinkTo>
    
    <LinkTo @route="operations.map" class="nav-item">
        <FaIcon @icon="map" />
        <span>Carte</span>
    </LinkTo>
</nav>
```

**Marine Maroc Theme:**
```css
/* console/app/styles/custom.css */
:root {
    --primary-color: #0047AB;      /* Marine Blue */
    --primary-hover: #003580;
    --accent-color: #00CED1;       /* Ocean Teal */
    --accent-hover: #00B8BA;
    
    --success-color: #48BB78;      /* Green */
    --warning-color: #ED8936;      /* Orange */
    --error-color: #F56565;        /* Red */
    
    --text-color: #2D3748;
    --background-color: #FFFFFF;
    --surface-color: #F7FAFC;
}

.console-header {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.status-badge.completed {
    background-color: var(--success-color);
}

.status-badge.in-progress {
    background-color: var(--warning-color);
}

.status-badge.assigned {
    background-color: var(--accent-color);
}
```

### 2. Mobile App - Arabic-First Design

**Technology Stack:**
- React Native 0.77
- React Navigation 7 (RTL support)
- React Native Reanimated (animations)
- React Native Gesture Handler (touch interactions)
- React Native Voice (voice messages)
- React Native Haptic Feedback

**App Structure:**
```
navigator-app/src/
├── screens/
│   ├── HomeScreen.tsx           # 3 big buttons
│   ├── LoadDetailsScreen.tsx    # Icons + minimal Arabic
│   ├── ActiveTripScreen.tsx     # Map + big "Arrived" button
│   ├── ProofOfDeliveryScreen.tsx # Camera + signature
│   └── VoiceMessagesScreen.tsx  # Hold-to-record
├── components/
│   ├── BigButton.tsx            # 80x80pt touch target
│   ├── IconButton.tsx           # Icon-first button
│   ├── StatusBadge.tsx          # Color-coded status
│   └── VoiceRecorder.tsx        # Voice message component
├── navigation/
│   └── AppNavigator.tsx         # RTL navigation
├── theme/
│   ├── colors.ts                # Marine Maroc colors
│   ├── typography.ts            # Arabic fonts
│   └── spacing.ts               # Large spacing
└── i18n/
    └── ar.json                  # Arabic translations
```

### 3. Icon-Heavy Design System

**Icon Library:**
```typescript
// src/theme/icons.ts
export const Icons = {
    // Primary Actions
    start: '▶️',           // Start trip
    stop: '⏸️',            // Pause
    done: '✅',            // Complete
    cancel: '❌',          // Cancel
    
    // Navigation
    home: '🏠',            // Home
    loads: '📦',           // Loads
    messages: '💬',        // Messages
    map: '🗺️',            // Map
    
    // Proof of Delivery
    camera: '📷',          // Take photo
    signature: '✍️',       // Signature
    voice: '🎤',           // Voice message
    
    // Status
    available: '🟢',       // Available
    onRoute: '🟡',         // On route
    busy: '🔴',            // Busy
    offline: '⚪',         // Offline
    
    // Emergency
    help: '🆘',            // Emergency/Problem
};
```

**BigButton Component:**
```typescript
// src/components/BigButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Haptic from 'react-native-haptic-feedback';

interface BigButtonProps {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
    disabled?: boolean;
}

export const BigButton: React.FC<BigButtonProps> = ({
    icon,
    label,
    onPress,
    color = '#0047AB',
    disabled = false,
}) => {
    const handlePress = () => {
        Haptic.trigger('impactMedium');
        onPress();
    };
    
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 160,
        height: 160,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        fontSize: 48,
        marginBottom: 8,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Cairo-Bold', // Arabic font
    },
});
```

### 4. RTL (Right-to-Left) Layout

**Configuration:**
```typescript
// App.tsx
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';

// Enable RTL for Arabic
if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
    RNRestart.Restart();
}
```

**RTL-Aware Navigation:**
```typescript
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager } from 'react-native';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: true,
                    animation: I18nManager.isRTL ? 'slide_from_left' : 'slide_from_right',
                    headerTitleAlign: 'center',
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                {/* ... other screens */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
```

### 5. Voice Message System

**Voice Recorder Component:**
```typescript
// src/components/VoiceRecorder.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Voice from '@react-native-voice/voice';
import Haptic from 'react-native-haptic-feedback';

export const VoiceRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const scaleAnim = useState(new Animated.Value(1))[0];
    
    const startRecording = async () => {
        Haptic.trigger('impactHeavy');
        setIsRecording(true);
        
        // Animate button
        Animated.spring(scaleAnim, {
            toValue: 1.2,
            useNativeDriver: true,
        }).start();
        
        // Start recording
        await Voice.start('ar-MA'); // Moroccan Arabic
        
        // Start duration timer
        const interval = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);
    };
    
    const stopRecording = async () => {
        Haptic.trigger('impactMedium');
        setIsRecording(false);
        
        // Reset animation
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
        
        // Stop recording
        await Voice.stop();
        
        // Upload voice message
        // ... upload logic
        
        setRecordingDuration(0);
    };
    
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.recordButton,
                    isRecording && styles.recordButtonActive,
                ]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
                activeOpacity={0.8}
            >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Text style={styles.icon}>🎤</Text>
                </Animated.View>
                <Text style={styles.label}>
                    {isRecording ? `${recordingDuration}s` : 'اضغط للتسجيل'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    recordButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#0047AB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButtonActive: {
        backgroundColor: '#F56565',
    },
    icon: {
        fontSize: 64,
    },
    label: {
        fontSize: 18,
        color: '#FFFFFF',
        marginTop: 8,
        fontFamily: 'Cairo-Bold',
    },
});
```

### 6. Screen Designs

**Home Screen:**
```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { BigButton } from '../components/BigButton';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Marine Maroc</Text>
            </View>
            
            <View style={styles.buttonsContainer}>
                <BigButton
                    icon="📦"
                    label="شحنات جديدة"
                    onPress={() => navigation.navigate('Loads')}
                    color="#0047AB"
                />
                
                <BigButton
                    icon="🗺️"
                    label="موقعي"
                    onPress={() => navigation.navigate('Map')}
                    color="#00CED1"
                />
                
                <BigButton
                    icon="💬"
                    label="رسائل"
                    onPress={() => navigation.navigate('Messages')}
                    color="#48BB78"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    header: {
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        marginTop: 8,
        fontFamily: 'Cairo-Bold',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
```

**Active Trip Screen:**
```typescript
// src/screens/ActiveTripScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { BigButton } from '../components/BigButton';

export const ActiveTripScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 33.5731,
                    longitude: -7.5898,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                <Marker coordinate={{ latitude: 33.5731, longitude: -7.5898 }} />
            </MapView>
            
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>⏱️ الوقت المتبقي: 2 ساعة</Text>
                <Text style={styles.infoText}>📍 المسافة: 120 كم</Text>
            </View>
            
            <View style={styles.buttonsContainer}>
                <BigButton
                    icon="✅"
                    label="وصلت"
                    onPress={() => {/* Navigate to POD */}}
                    color="#48BB78"
                />
                
                <BigButton
                    icon="🆘"
                    label="مشكلة"
                    onPress={() => {/* Report problem */}}
                    color="#F56565"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    infoText: {
        fontSize: 18,
        color: '#2D3748',
        marginVertical: 4,
        fontFamily: 'Cairo-Regular',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
});
```

### 7. Offline Support

**Offline Storage:**
```typescript
// src/utils/offlineStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OfflineStorage = {
    // Store order data
    async saveOrders(orders: Order[]) {
        await AsyncStorage.setItem('offline_orders', JSON.stringify(orders));
    },
    
    // Store GPS locations
    async saveLocation(location: Location) {
        const locations = await this.getLocations();
        locations.push(location);
        await AsyncStorage.setItem('offline_locations', JSON.stringify(locations));
    },
    
    // Store photos
    async savePhoto(orderId: string, photoUri: string) {
        const photos = await this.getPhotos(orderId);
        photos.push(photoUri);
        await AsyncStorage.setItem(`offline_photos_${orderId}`, JSON.stringify(photos));
    },
    
    // Sync when online
    async syncOfflineData() {
        const locations = await this.getLocations();
        const photos = await this.getAllPhotos();
        
        // Upload to API
        // ... sync logic
        
        // Clear offline data after successful sync
        await this.clearOfflineData();
    },
};
```

### 8. Visual Feedback System

**Animations:**
```typescript
// src/utils/animations.ts
import { Animated } from 'react-native';

export const Animations = {
    // Success animation
    success: (value: Animated.Value) => {
        return Animated.sequence([
            Animated.spring(value, {
                toValue: 1.2,
                useNativeDriver: true,
            }),
            Animated.spring(value, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]);
    },
    
    // Error shake animation
    error: (value: Animated.Value) => {
        return Animated.sequence([
            Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(value, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(value, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]);
    },
};
```

**Haptic Feedback:**
```typescript
// src/utils/haptics.ts
import Haptic from 'react-native-haptic-feedback';

export const Haptics = {
    light: () => Haptic.trigger('impactLight'),
    medium: () => Haptic.trigger('impactMedium'),
    heavy: () => Haptic.trigger('impactHeavy'),
    success: () => Haptic.trigger('notificationSuccess'),
    error: () => Haptic.trigger('notificationError'),
};
```

## Data Models

### Arabic Font Configuration

```typescript
// src/theme/typography.ts
export const Typography = {
    fonts: {
        regular: 'Cairo-Regular',
        bold: 'Cairo-Bold',
        semiBold: 'Cairo-SemiBold',
    },
    sizes: {
        small: 14,
        medium: 16,
        large: 18,      // Minimum for Arabic
        xlarge: 24,
        xxlarge: 32,
    },
};
```

**Install Arabic Fonts:**
```bash
# Download Cairo font (Google Fonts)
# Add to android/app/src/main/assets/fonts/
# Add to ios/NavigatorApp/Fonts/
```

## Error Handling

### User-Friendly Error Messages

```typescript
// src/utils/errorMessages.ts
export const ErrorMessages = {
    ar: {
        network: 'لا يوجد اتصال بالإنترنت',
        camera: 'لا يمكن الوصول إلى الكاميرا',
        location: 'لا يمكن الوصول إلى الموقع',
        generic: 'حدث خطأ. حاول مرة أخرى',
    },
};
```

## Testing Strategy

### Usability Testing with Low-Literacy Drivers

**Test Protocol:**
1. Give driver phone with app installed
2. No written instructions
3. Ask driver to complete tasks:
   - Find new load
   - Start trip
   - Send voice message
   - Complete delivery
4. Observe and note difficulties
5. Iterate on design

**Success Criteria:**
- 90%+ task completion without help
- <5 minutes to learn app
- Positive feedback from drivers

## Performance Targets

- App launch: <3 seconds
- Screen transitions: <500ms
- Voice message recording: Instant start
- Photo capture: <1 second
- Offline mode: Seamless
- Battery drain: <15% per 8-hour shift

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Ready for Implementation
