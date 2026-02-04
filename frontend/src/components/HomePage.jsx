import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Search, Sparkles, LogOut, User } from "lucide-react";  // ÚJ: User icon
import { Button } from "./ui/button";
import { authService } from "../service/api";

function HomePage() {
  const navigate = useNavigate();

  // Auth ellenőrzés - ha nincs bejelentkezve, login-ra dob
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const features = [
    {
      icon: Search,
      title: "Find Study Groups",
      description: "Search through hundreds of subjects and find the perfect study group for your courses"
    },
    {
      icon: Users,
      title: "Connect with Peers",
      description: "Join groups and collaborate with fellow students who share your academic interests"
    },
    {
      icon: BookOpen,
      title: "Organize Your Studies",
      description: "Keep track of all your study groups and manage your academic schedule efficiently"
    },
    {
      icon: Sparkles,
      title: "Excel Together",
      description: "Achieve better grades through collaborative learning and peer support"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-0 md:pt-0">
      {/* Header - KIJELENTKEZÉS + ÚJ PROFIL gomb */}
      <header className="container mx-auto px-6 py-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">StudyConnect</h1>
          <div className="flex items-center gap-2">
            {/* ÚJ: Profil gomb */}
            <Button 
              onClick={() => navigate("/profile")} 
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-primary/10"
            >
              <User className="w-4 h-4" />
              Profil
            </Button>
            {/* Kijelentkezés gomb */}
            <Button 
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4" />
              Kijelentkezés
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full shadow-lg mb-8">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl mb-6 text-primary">
            Welcome to StudyConnect
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find your perfect study group, connect with peers, and excel in your courses through collaborative learning
          </p>
          
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Button 
              onClick={() => navigate("/search")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Study Groups
            </Button>
            
            <Button 
              onClick={() => navigate("/mygroups")}
              variant="outline"
              className="px-8 py-6 text-lg rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
              <Users className="w-5 h-5 mr-2" />
              My Groups
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-sidebar rounded-3xl p-12 text-center shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl text-sidebar-foreground mb-2">500+</div>
              <div className="text-sidebar-foreground/80">Active Study Groups</div>
            </div>
            <div>
              <div className="text-4xl text-sidebar-foreground mb-2">2,500+</div>
              <div className="text-sidebar-foreground/80">Students Connected</div>
            </div>
            <div>
              <div className="text-4xl text-sidebar-foreground mb-2">150+</div>
              <div className="text-sidebar-foreground/80">Subjects Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
