import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import { useNavigate } from "react-router-dom";
import { 
  Sprout, 
  Satellite, 
  TrendingUp, 
  Shield, 
  Target,
  Award,
  Users,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Satellite,
      title: "Satellite Monitoring",
      description: "Real-time crop health analysis using satellite imagery and spectral indices",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Advanced ML models for yield prediction and anomaly detection",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Early warning systems for pest risks and soil conditions",
    },
    {
      icon: Sprout,
      title: "Precision Farming",
      description: "Data-driven insights for optimized agricultural practices",
    },
  ];

  const impactStats = [
    { icon: Target, value: "35%", label: "Yield Improvement", color: "text-green-600" },
    { icon: Award, value: "28%", label: "Cost Reduction", color: "text-blue-600" },
    { icon: Users, value: "10K+", label: "Happy Farmers", color: "text-purple-600" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Wheat Farmer, Punjab",
      content: "AgriMonitor helped me increase my wheat yield by 40% while reducing water usage by 25%. The AI predictions are incredibly accurate!",
      rating: 5,
    },
    {
      name: "Maria Santos",
      role: "Organic Farm Owner, California",
      content: "The early warning system saved my entire crop from a pest outbreak. This technology is revolutionary for sustainable farming.",
      rating: 5,
    },
    {
      name: "Chen Wei",
      role: "Agricultural Researcher, Beijing",
      content: "The detailed spectral analysis and temporal forecasting features have transformed how we approach crop management research.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation showHomeButton={false} />
      
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-primary/20 to-success/30">
        <div className="absolute inset-0 bg-success/10" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
          <div className="bg-success/20 backdrop-blur-sm rounded-3xl p-12 border border-success/30">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight text-foreground">
              AgriMonitor
            </h1>
            <p className="text-2xl md:text-3xl mb-4 font-light text-foreground/90">
              AI-Powered Precision Agriculture
            </p>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-foreground/80">
              Transform your farming with cutting-edge AI technology that monitors crop health, 
              predicts risks, and optimizes yields through satellite imagery and machine learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="default" 
                size="lg" 
                onClick={() => navigate("/signup")}
                className="text-lg px-10 py-6 rounded-full font-semibold shadow-feature hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate("/login")}
                className="text-lg px-10 py-6 rounded-full font-semibold transition-all duration-300"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Proven Results That Matter
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of farmers worldwide who are already using AgriMonitor 
              to achieve remarkable improvements in their agricultural operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center shadow-feature hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in border-0">
                <CardContent className="p-8">
                  <stat.icon className={`h-16 w-16 mx-auto mb-6 ${stat.color}`} />
                  <div className={`text-5xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-lg font-medium text-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Revolutionary AI Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced platform combines satellite imagery, machine learning, 
              and precision agriculture to deliver actionable insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center shadow-feature hover:shadow-xl transition-all duration-300 group cursor-pointer hover:bg-success hover:text-white border-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <feature.icon className="h-16 w-16 text-primary mx-auto mb-6 group-hover:text-white transition-colors duration-300" />
                  <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              What Farmers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real success stories from farmers who transformed their operations with AgriMonitor.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="shadow-testimonial hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-gradient-earth shadow-farm-card border-0 animate-fade-in">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-foreground text-center">
                About AgriMonitor
              </h3>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-foreground leading-relaxed text-lg">
                    AgriMonitor represents the next generation of precision agriculture technology, 
                    leveraging cutting-edge AI and machine learning to transform how farmers monitor 
                    and manage their crops.
                  </p>
                  <p className="text-foreground leading-relaxed text-lg">
                    Our platform automatically extracts and analyzes satellite data, hyperspectral 
                    imagery, and sensor readings to provide real-time insights into crop health, 
                    soil conditions, and potential risks.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {["NDVI Analysis", "Risk Prediction", "Yield Optimization", "Sustainable Practices"].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-primary/10 p-8 rounded-2xl">
                    <Satellite className="h-24 w-24 text-primary mx-auto mb-4" />
                    <p className="text-center text-foreground font-medium">Advanced Satellite Technology</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Technologies Section */}
          <div className="mt-16 animate-fade-in">
            <div className="text-center mb-12">
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Key Technologies</h4>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powered by cutting-edge AI and machine learning algorithms
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Advanced Vegetation Indices", desc: "NDVI, NDWI, SAVI, RE-NDVI analysis" },
                { title: "Anomaly Detection", desc: "Sophisticated algorithms for early problem detection" },
                { title: "Temporal Forecasting", desc: "Trend analysis and predictive modeling" },
                { title: "Satellite Data Processing", desc: "Real-time analysis of satellite imagery" },
                { title: "Machine Learning", desc: "AI-powered risk assessment and insights" },
                { title: "Precision Agriculture", desc: "Data-driven farming optimization" }
              ].map((tech, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-muted/30">
                  <CardContent className="p-0">
                    <h5 className="font-bold text-foreground mb-2">{tech.title}</h5>
                    <p className="text-muted-foreground text-sm">{tech.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
