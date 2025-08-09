import React from 'react';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  CpuChipIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: CpuChipIcon,
      title: 'Vision Transformer Architecture',
      description: 'Advanced ViT model specifically designed for analyzing CRISPR sequence compatibility patterns with attention mechanisms.'
    },
    {
      icon: BeakerIcon,
      title: 'Biological Accuracy',
      description: 'Incorporates PAM sequence validation, GC content analysis, and established CRISPR-Cas9 cutting principles.'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Analytics',
      description: 'Comprehensive performance metrics including accuracy, precision, recall, and confidence distributions.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Robust Validation',
      description: 'Four-category prediction system with detailed performance tracking and confusion matrix analysis.'
    }
  ];

  const techStack = [
    {
      category: 'Frontend',
      technologies: ['React 18', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'React Router']
    },
    {
      category: 'Backend',
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Multer']
    },
    {
      category: 'AI/ML',
      technologies: ['TensorFlow', 'Python Flask', 'Vision Transformer', 'NumPy', 'Pandas']
    },
    {
      category: 'Deployment',
      technologies: ['Docker', 'PM2', 'Nginx', 'MongoDB Atlas', 'Cloud Storage']
    }
  ];

  const performance = [
    { metric: 'Model Accuracy', value: '68.5%', description: 'Overall prediction accuracy' },
    { metric: 'Processing Time', value: '<200ms', description: 'Average prediction latency' },
    { metric: 'F1 Score', value: '68.9%', description: 'Balanced precision-recall metric' },
    { metric: 'Input Types', value: '2', description: 'Text and image inputs supported' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center"
      >
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AcademicCapIcon className="w-4 h-4" />
            <span>About the Project</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            CRISPR Success Prediction
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            An advanced machine learning platform that predicts CRISPR gene editing success rates 
            using Vision Transformer technology and comprehensive sequence analysis.
          </p>
        </motion.div>
      </motion.div>

      {/* Overview */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-white rounded-2xl shadow-card p-8"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Revolutionizing Gene Editing Prediction
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                This platform combines cutting-edge artificial intelligence with established 
                biological principles to predict the success of CRISPR-Cas9 gene editing operations.
              </p>
              <p>
                Our Vision Transformer model analyzes sequence compatibility patterns, PAM sequences, 
                and base-pair matching to provide accurate predictions with confidence scores.
              </p>
              <p>
                The system supports both text-based sequence input and image recognition, 
                making it accessible for various research workflows and educational purposes.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {performance.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl text-center"
              >
                <div className="text-2xl font-bold text-indigo-900 mb-2">{item.value}</div>
                <div className="text-sm font-medium text-indigo-700 mb-1">{item.metric}</div>
                <div className="text-xs text-indigo-600">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Key Features */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600">
            Advanced capabilities designed for researchers and students
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-gray-50 rounded-2xl p-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CodeBracketIcon className="w-4 h-4" />
            <span>Technology Stack</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technologies</h2>
          <p className="text-lg text-gray-600">
            Leveraging the latest in web development and machine learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{stack.category}</h3>
              <div className="space-y-2">
                {stack.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block mr-2 mb-2"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">
            Understanding the prediction process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Sequence Input',
              description: 'Input guide RNA and target DNA sequences (23 nucleotides each) via text or image upload.',
              icon: BeakerIcon
            },
            {
              step: '02', 
              title: 'AI Analysis',
              description: 'Vision Transformer model analyzes base-pair compatibility and PAM sequence patterns.',
              icon: CpuChipIcon
            },
            {
              step: '03',
              title: 'Prediction Result',
              description: 'Receive success prediction with confidence score and detailed analysis metrics.',
              icon: ChartBarIcon
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Model Performance */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-blue-50 rounded-2xl p-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Model Performance & Limitations</h2>
          <p className="text-lg text-gray-600">
            Understanding the current capabilities and areas for improvement
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 68.5% accuracy on validation dataset</li>
                <li>• Real-time predictions (&lt;200ms)</li>
                <li>• PAM sequence validation</li>
                <li>• Comprehensive analytics dashboard</li>
                <li>• Support for multiple input types</li>
                <li>• Professional MERN stack architecture</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <LightBulbIcon className="w-5 h-5 text-yellow-600 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Limited training dataset (200 samples)</li>
                <li>• Confidence scores in 58-68% range</li>
                <li>• Simplified biological modeling</li>
                <li>• Image processing not fully implemented</li>
                <li>• Need for larger, more diverse datasets</li>
                <li>• Integration with experimental validation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Future Directions */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="text-center"
      >
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <GlobeAltIcon className="w-12 h-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Future Development</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            This platform serves as a foundation for advanced CRISPR prediction systems. 
            Future enhancements will include expanded datasets, improved model architectures, 
            and integration with experimental validation workflows.
          </p>
          <div className="text-sm opacity-75">
            Built for educational and research purposes • Open to collaboration and improvement
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default About;
