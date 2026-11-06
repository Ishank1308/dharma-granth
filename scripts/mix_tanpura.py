"""
Pure Python 432Hz Vedic Tanpura Acoustic Generator & Audio Mixer
No external heavy dependencies required (uses built-in wave, struct, math).
"""

import math
import struct
import wave
import sys
import os

def generate_tanpura_sample(t, sample_rate=22050):
    # Classical Sa-Pa-Sa-Sa plucked string sequence:
    # String 1: Pancham (Pa) 204.15 Hz - plucked at t=0.0s
    # String 2: Jori Sa (Tar Sa) 272.20 Hz - plucked at t=1.0s
    # String 3: Jori Sa (Tar Sa) 272.20 Hz - plucked at t=2.0s
    # String 4: Kharaj Sa (Mandra Sa) 136.10 Hz - plucked at t=3.0s
    # Cycle length: 4.0 seconds
    
    cycle_time = t % 4.0
    
    plucks = [
        (0.0, 204.15, 0.28), # Pa
        (1.0, 272.20, 0.24), # Sa
        (2.0, 272.20, 0.24), # Sa
        (3.0, 136.10, 0.35), # Kharaj Sa
    ]
    
    val = 0.0
    for pluck_t, freq, amp in plucks:
        time_since_pluck = cycle_time - pluck_t
        if time_since_pluck >= 0:
            decay = math.exp(-time_since_pluck * 0.9)
            # Fundamental + Jawari overtones (1st, 2nd, 3rd harmonics)
            harmonics = (
                math.sin(2 * math.pi * freq * t) * 0.65 +
                math.sin(2 * math.pi * freq * 2.0 * t) * 0.22 +
                math.sin(2 * math.pi * freq * 3.0 * t) * 0.10 +
                math.sin(2 * math.pi * freq * 4.0 * t) * 0.03
            )
            val += harmonics * amp * decay
            
    return val

def generate_tanpura_wav(output_path, duration_sec, sample_rate=22050):
    total_frames = int(sample_rate * duration_sec)
    with wave.open(output_path, 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        
        frames = bytearray()
        for i in range(total_frames):
            t = i / sample_rate
            # Fade in over 1.5s, fade out over 1.5s
            fade = 1.0
            if t < 1.5:
                fade = t / 1.5
            elif t > duration_sec - 1.5:
                fade = max(0.0, (duration_sec - t) / 1.5)
                
            sample = generate_tanpura_sample(t, sample_rate) * fade
            clamped = max(-32767, min(32767, int(sample * 16000)))
            frames.extend(struct.pack('<h', clamped))
            
        wav.writeframes(frames)
    print(f"Generated Tanpura WAV: {output_path} ({duration_sec:.1f}s)")

if __name__ == '__main__':
    if len(sys.argv) > 2:
        out_path = sys.argv[1]
        dur = float(sys.argv[2])
        generate_tanpura_wav(out_path, dur)
    else:
        print("Usage: python mix_tanpura.py <output.wav> <duration_sec>")
