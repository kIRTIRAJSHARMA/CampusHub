import { motion } from "framer-motion";

const JsonAnimation = ({ animation, className = "", size = "h-48 w-full" }) => {
  if (!animation?.elements?.length) return null;

  const getTransition = (transition) => {
    const normalized = {
      duration: animation.duration || 2,
      ...(transition || {}),
    };

    normalized.repeat = transition?.repeat === null || transition?.repeat === undefined ? (animation.loop ? Infinity : 0) : transition.repeat;
    return normalized;
  };
  const positionClass = size.includes("absolute") ? "" : "relative";

  return (
    <div className={`${positionClass} overflow-hidden ${size} ${animation.sceneClass || ""} ${className}`} aria-label={animation.name}>
      {animation.elements.map((element, index) => {
        const Element = motion.div;

        return (
          <Element
            key={`${element.type}-${index}`}
            className={element.className}
            style={element.style}
            initial={element.initial}
            animate={element.animate}
            transition={getTransition(element.transition)}
          >
            {element.content}
          </Element>
        );
      })}
    </div>
  );
};

export default JsonAnimation;
