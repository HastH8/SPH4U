export const posts = [
  {
    id: 1,
    userId: 1,
    text: "Final week update: we ran the smart physics car tests in class today. The car streamed live data to the dashboard while we did straight-line runs and braking tests. We measured distance, speed, acceleration, kinetic energy, momentum, and power in real time.\n\nWe tested tile vs carpet and two different masses. The heavier setup had lower acceleration and a longer stopping distance, which matched our F = ma and friction predictions. Next step is finalizing the slides and adding the charts to the site.",
    timestamp: "2026-01-20T09:30:00",
    image: null,
    expanded: false
  },
  {
    id: 2,
    userId: 4,
    text: "We did a lightweight pass on the build. We trimmed extra plastic, shortened wires, and moved the battery lower and centered. The car accelerates more smoothly now and the graphs have less wobble.\n\nThis also helped our calculations because the mass is more consistent and the wheels have better traction.",
    timestamp: "2026-01-18T17:10:00",
    image: null,
    expanded: false
  },
  {
    id: 3,
    userId: 4,
    text: "Spent today cleaning the data and making graphs for the dashboard. The acceleration curve spikes at launch and then slowly drops as friction and drag balance the motor force.\n\nWe compared speed from the wheel encoder vs speed from the IMU integration and the encoder stayed more stable. The IMU still helped us confirm trends, so we used both and explained the difference in the write-up.",
    timestamp: "2026-01-12T18:05:00",
    image: null,
    expanded: false
  },
  {
    id: 4,
    userId: 3,
    text: "Conference #4 done. Mr Hill wanted us to be clear about safety, so we capped the speed and kept runs short. We now have 6 sources, the APA page, and the website is basically finished.\n\nWe showed the live dashboard and explained how the car calculates v, a, F, KE, and momentum from the sensor data.",
    timestamp: "2026-01-07T16:20:00",
    image: null,
    expanded: false
  },
  {
    id: 5,
    userId: 3,
    text: "We finally fixed the wheel stopping issue. The axle was too tight, so we added small washers/spacers and re-centered the wheels. We also made sure the motor mount was straight so the wheels do not rub the frame.\n\nAfter that, rolling friction dropped and the car moves way smoother.",
    timestamp: "2026-01-02T14:40:00",
    image: null,
    expanded: false
  },
  {
    id: 6,
    userId: 1,
    text: "Parts came in today (encoder, IMU, motor driver, and new wheels). We mounted everything, secured the wiring, and did a quick test run in the hallway.\n\nThe data stream works, but we still need to calibrate the IMU and lock down the sampling rate.",
    timestamp: "2025-12-22T16:30:00",
    image: null,
    expanded: false
  },
  {
    id: 7,
    userId: 1,
    text: "Conference #3 check-in: experiment plan is finalized. Independent variables are surface type (tile vs carpet), added mass, and slope angle. Dependent variables are acceleration, average speed, stopping distance, and energy loss.\n\nWe will run 3 trials for each setup and use the dashboard graphs plus a data table for averages.",
    timestamp: "2025-12-16T15:10:00",
    image: null,
    expanded: false
  },
  {
    id: 8,
    userId: 4,
    text: "Prototype build update: we started with a smart physics ball idea, but Mr Hill said it could break and be unsafe. We switched to a car chassis so the sensors are protected and we can control the motion.\n\nWe mounted the IMU, encoder, and battery, and kept the wiring short to reduce noise. First drive test was stable, but the data had jitter so we added filtering.",
    timestamp: "2025-12-10T19:40:00",
    image: null,
    expanded: false
  },
  {
    id: 9,
    userId: 3,
    text: "We collected two solid sources each and wrote summaries + APA references. I also started the live dashboard and connected it to Firebase so the data shows up instantly.\n\nOur research focuses on kinematics, friction, sensor accuracy, and why wheel slip affects speed calculations.",
    timestamp: "2025-11-30T17:55:00",
    image: null,
    expanded: false
  },
  {
    id: 10,
    userId: 1,
    text: "Conference #2 went well. We showed Mr Hill our sources and the group plan. We agreed the focus is a smart physics car that streams sensor data to a dashboard and calculates key equations (v = d/t, a = dv/dt, F = ma, KE = 1/2 mv^2).\n\nHe approved it as long as we keep speeds safe and document our method clearly.",
    timestamp: "2025-11-25T15:35:00",
    image: null,
    expanded: false
  },
  {
    id: 11,
    userId: 4,
    text: "We made a parts list and ordered everything: chassis kit, IMU sensor, wheel encoder, motor driver, and extra wheels. We kept it low budget and used what we already had from class.\n\nWaiting for shipping so we can build the full prototype.",
    timestamp: "2025-11-21T18:10:00",
    image: null,
    expanded: false
  },
  {
    id: 12,
    userId: 4,
    text: "Conference #1 summary: we explained the project, listed two possible ideas (smart physics ball vs smart physics car), and argued that the car is safer and easier to test.\n\nMr Hill said the idea is strong because it connects kinematics, dynamics, and energy, and we can collect real data.",
    timestamp: "2025-11-18T14:10:00",
    image: null,
    expanded: false
  },
  {
    id: 13,
    userId: 3,
    text: "Brainstorm day. My questions so far: How does added mass change acceleration and stopping distance? How does surface friction change the results? How accurate are the sensors compared to manual measurements?\n\nThis feels like a good mix of physics and engineering.",
    timestamp: "2025-11-10T16:05:00",
    image: null,
    expanded: false
  },
  {
    id: 14,
    userId: 1,
    text: "We finally understand the assignment: pick a physics topic, research it, build something, and show results on the site. We want to build a smart physics car that calculates equations live and makes physics feel real.\n\nNext step is to lock the idea and start gathering sources.",
    timestamp: "2025-11-05T13:20:00",
    image: null,
    expanded: false
  }
]
