"use client";
import React from "react";

// Book colors
const bookColors: Record<number, string> = {
  0: "#ebedf0", // no reading (dark grey for dark mode)
  1: "#ff6b6b", // Book 1
  2: "#4dabf7", // Book 2
  3: "#51cf66", // Book 3
};

// Generate dummy data (120 days for wider graph)
const generateDummyData = () => {
  const totalDays = 120;
  const currentStreak = 14;
  const totalActive = 32;
  const activeBeforeStreak = totalActive - currentStreak; // 18
  const daysBeforeStreak = totalDays - currentStreak; // 106
  
  const data = Array(totalDays).fill(0);
  
  // Last 14 days are the current streak
  for (let i = totalDays - currentStreak; i < totalDays; i++) {
    data[i] = Math.ceil(Math.random() * 3); // 1, 2, or 3
  }
  
  // Randomly distribute the remaining 18 active days in the first 106 days
  let placed = 0;
  while (placed < activeBeforeStreak) {
    const randomIndex = Math.floor(Math.random() * daysBeforeStreak);
    if (data[randomIndex] === 0) {
      data[randomIndex] = Math.ceil(Math.random() * 3);
      placed++;
    }
  }
  
  return data;
};

const data = generateDummyData();

export default function ReadingHeatmap() {
  const weeks = [];

  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  // Generate month labels for the header row
  const monthLabels = weeks.map((week, index) => {
    if (index % 4 === 0) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May"];
      return monthNames[index / 4] || "";
    }
    return "";
  });

  return (
    <div style={{ padding: "40px 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Reading Streak
      </h2>

      {/* Centered container */}
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        
        {/* Month Labels */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            maxWidth: "1000px",
            width: "100%",
            justifyContent: "center",
            marginBottom: "8px"
          }}
        >
          {monthLabels.map((label, i) => (
             <div key={i} style={{ width: "1.2vw", minWidth: "16px", maxWidth: "20px", fontSize: "12px", color: "#9ca3af", position: "relative", height: "16px" }}>
                {label && <span style={{ position: "absolute", left: 0, bottom: 0 }}>{label}</span>}
             </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            maxWidth: "1000px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {weeks.map((week, wi) => (
            <div
              key={wi}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {week.map((day, di) => (
                <div
                  key={di}
                  style={{
                    width: "1.2vw",
                    height: "1.2vw",
                    minWidth: "16px",
                    minHeight: "16px",
                    maxWidth: "20px",
                    maxHeight: "20px",
                    backgroundColor: bookColors[day],
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  title={
                    day === 0
                      ? "No reading"
                      : `Read Book ${day}`
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "14px", color: "#9ca3af" }}>Less</span>

        {Object.entries(bookColors).map(([key, color]) => (
          <div
            key={key}
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: color,
              borderRadius: "3px",
            }}
          />
        ))}

        <span style={{ fontSize: "14px", color: "#9ca3af" }}>More</span>
      </div>
    </div>
  );
}
