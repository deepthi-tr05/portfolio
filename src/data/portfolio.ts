/**
 * CENTRAL PORTFOLIO KNOWLEDGE BASE
 * Single source of truth consumed by UI sections and the AI assistant.
 */

export const profile = {
  name: "Deepthi T R",
  role: "Artificial Intelligence & Machine Learning Engineer",
  education: {
    level: "Final Year Engineering Student",
    institute: "GSSS Institute of Engineering and Technology for Women, Mysuru",
    specialization: "Artificial Intelligence & Machine Learning",
  },
  location: "Mysuru, India",
  objective:
    "Aspiring AIML engineer passionate about building intelligent systems, AI-powered applications, conversational interfaces, and innovative user experiences using machine learning and modern technologies.",
  interests: [
    "Artificial Intelligence",
    "Machine Learning",
    "Conversational AI",
    "Computer Vision",
    "Intelligent Systems",
    "Human-AI Interaction",
  ],
};

export const links = {
  github: "https://github.com/deepthi-tr05",
  linkedin: "https://in.linkedin.com/in/deepthi-tr",
  linktree: "https://linktr.ee/deepthitr",
  email: "mailto:deepthitr05@gmail.com",
};

export const skills = {
  "Programming Languages": ["Java", "C", "Python"],
  "Frontend Development": ["HTML", "CSS", "JavaScript"],
  "Backend Development": ["PHP", "Flask"],
  "AI & Machine Learning": ["TensorFlow", "Keras", "CNN"],
  Databases: ["SQL", "MongoDB"],
  "Tools & Platforms": ["Git", "GitHub", "Unity", "C#"],
};

export interface ProjectInfo {
  id: string;
  title: string;
  category: string;
  stack: string[];
  description: string;
  highlight?: string;
  sectionId: string;
}

export const projects: ProjectInfo[] = [
  {
    id: "brain-tumor",
    title: "Brain Tumor Detection System",
    category: "Medical Vision Intelligence",
    stack: ["Python", "CNN", "TensorFlow", "Keras"],
    description:
      "AI-powered medical image analysis system that detects brain tumors from MRI scans using deep learning. A CNN model processes MRI imagery to support automated diagnostics.",
    highlight: "Featured project — deep learning applied to medical imaging.",
    sectionId: "projects",
  },
  {
    id: "hostel-mgmt",
    title: "Hostel Management System",
    category: "Operational Infrastructure",
    stack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    description:
      "Smart hostel management system handling student registration, room allocation, and day-to-day hostel operations with an admin dashboard and live database.",
    sectionId: "projects",
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    category: "Conversational Intelligence",
    stack: ["HTML", "CSS", "Flask"],
    description:
      "AI-powered chatbot supporting both voice and text interaction, built with Flask, designed for intelligent communication experiences.",
    sectionId: "projects",
  },
  {
    id: "iris-pca-viz",
    title: "Iris PCA Visualizer",
    category: "Data Science Visualization",
    stack: ["HTML", "CSS", "JavaScript"],
    description:
      "Interactive Principal Component Analysis visualizer on the Iris dataset. Explore dimensionality reduction live in the browser.",
    sectionId: "projects",
  },
  {
    id: "lwr-visualizer",
    title: "LWR Visualizer",
    category: "ML Algorithm Visualization",
    stack: ["HTML", "CSS", "JavaScript"],
    description:
      "Interactive Locally Weighted Regression visualizer — paint data points on a canvas and watch the model fit in real time.",
    sectionId: "projects",
  },
  {
    id: "gaussian-nb",
    title: "Gaussian Naive Bayes",
    category: "ML Classifier Demo",
    stack: ["TypeScript", "React", "Vite"],
    description:
      "Interactive Gaussian Naive Bayes classifier visualizer demonstrating probabilistic classification with live charts.",
    sectionId: "projects",
  },
  {
    id: "knn-classifier",
    title: "KNN Classifier Visualizer",
    category: "ML Algorithm Visualization",
    stack: ["TypeScript", "React", "Vite"],
    description:
      "Visual K-Nearest Neighbors classifier explorer with California housing dataset integration and decision boundary rendering.",
    sectionId: "projects",
  },
  {
    id: "california-housing-matrix",
    title: "California Housing Matrix",
    category: "Data Science Dashboard",
    stack: ["TypeScript", "React", "Recharts"],
    description:
      "Interactive correlation matrix and feature analysis dashboard for the California housing dataset.",
    sectionId: "projects",
  },
  {
    id: "california-housing",
    title: "California Housing Explorer",
    category: "Data Science Dashboard",
    stack: ["TypeScript", "React", "Recharts", "Tailwind CSS"],
    description:
      "Interactive California housing dataset explorer with visualizations built using React, Recharts, and Tailwind CSS.",
    sectionId: "projects",
  },
  {
    id: "find-s",
    title: "Find-S Algorithm",
    category: "ML Algorithm Visualization",
    stack: ["TypeScript", "React", "Vite"],
    description:
      "Interactive Find-S algorithm visualizer for concept learning — step through hypothesis generalization on training examples.",
    sectionId: "projects",
  },
  {
    id: "decision-tree",
    title: "Decision Tree Visualizer",
    category: "ML Algorithm Visualization",
    stack: ["TypeScript", "React", "Vite"],
    description:
      "Interactive Decision Tree algorithm visualizer — explore node splitting, information gain, and classification tree construction.",
    sectionId: "projects",
  },
  {
    id: "ml-regression-viz",
    title: "ML Regression Viz",
    category: "ML Visualization",
    stack: ["JavaScript"],
    description:
      "Interactive machine learning regression visualizer with live plotting and model fitting capabilities.",
    sectionId: "projects",
  },
  {
    id: "vr-cnn",
    title: "CNN Visualization in Virtual Reality",
    category: "Experimental Research",
    stack: ["Unity", "C#", "CNN", "VR"],
    description:
      "An experimental immersive VR environment that helps users understand deep learning workflows and CNN operations through interactive spatial visualization.",
    highlight: "Experimental research — bridging deep learning and immersive 3D interaction.",
    sectionId: "lab",
  },
];

export const experience = [
  {
    company: "HLT Software Solutions, Tumakuru",
    role: "Software Engineer Intern",
    duration: "Jan 2024 – Mar 2024",
    summary:
      "Developed frontend components with Angular and Ionic, contributed to real-time applications (CMD Project, Learner App, Borrow App), implemented UI features, and assisted in debugging and optimization.",
  },
];

export const certifications = [
  "AWS Academy Graduate – Machine Learning Foundations",
  "Salesforce Trailblazer Certification",
  "Google Cloud Computing Foundations",
];

export const sections: Record<string, string> = {
  core: "Identity / About",
  skills: "Skill Matrix",
  projects: "Project Archive",
  experience: "Deployment History",
  certifications: "Credential Vault",
  github: "GitHub Analytics",
  lab: "Experimental AI Lab",
};
