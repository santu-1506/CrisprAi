import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  ChartBarIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      name: 'AI-Powered Predictions',
      description: 'Advanced Vision Transformer model analyzes CRISPR sequence compatibility with high accuracy.',
      icon: CpuChipIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Real-time Analytics',
      description: 'Comprehensive dashboard showing prediction performance, confidence scores, and success rates.',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Multiple Input Types',
      description: 'Support for both text-based sequence input and image-based sequence recognition.',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Scientific Accuracy',
      description: 'Built on established CRISPR principles including PAM sequence validation and match scoring.',
      icon: ShieldCheckIcon,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { name: 'Prediction Accuracy', value: '85%', description: 'Model accuracy on validation set' },
    { name: 'Processing Time', value: '<200ms', description: 'Average prediction time' },
    { name: 'Sequence Types', value: '2', description: 'Text and Image inputs supported' },
    { name: 'Categories', value: '4', description: 'Prediction result categories' }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative overflow-hidden py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <SparklesIcon className="w-4 h-4" />
                <span>AI-Powered Gene Editing Prediction</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                CRISPR Success
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Prediction
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Leverage advanced machine learning to predict CRISPR gene editing success rates. 
                Analyze sequence compatibility, PAM sequences, and guide RNA effectiveness with precision.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/predict"
                className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <BeakerIcon className="w-5 h-5 mr-2" />
                Start Predicting
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/analytics"
                className="group inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <ChartBarIcon className="w-5 h-5 mr-2" />
                View Analytics
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">{stat.name}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 ml-[-40rem] h-[25rem] w-[80rem] opacity-10">
            <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl"></div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 bg-white/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced CRISPR Analysis Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with biological expertise 
              to provide accurate gene editing predictions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group"
                >
                  <div className="bg-white rounded-xl p-6 shadow-card group-hover:shadow-card-hover transition-all duration-300 border border-gray-100 h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <LightBulbIcon className="w-12 h-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Predict CRISPR Success?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Start analyzing your CRISPR sequences today. Input your guide RNA and target DNA 
              sequences to get instant predictions with confidence scores.
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              <BeakerIcon className="w-5 h-5 mr-2" />
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
