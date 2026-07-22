import React from "react";

const ITEMS = [
  "TypeScript",
  "Node.js",
  "React.js",
  "MongoDB",
  "Kafka",
  "MQTT",
  "Docker",
  "Kubernetes",
  "Elasticsearch",
  "AWS",
  "Redis",
  "Git",
];

const TechMarquee: React.FC = () => {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee-track marquee-mask relative overflow-hidden border-y border-ink/15 py-4">
      <div className="marquee">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-display text-2xl md:text-3xl font-medium text-ink px-6">
              {item}
            </span>
            <span className="text-rust text-lg">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;
