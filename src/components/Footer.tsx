import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/40 border-t border-border mt-20">
      <div className="container mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-3 gap-12">
        
        {/* Brand Section */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">AgriMonitor</h3>
          <p className="text-muted-foreground leading-relaxed">
            Empowering farmers with AI-driven insights for sustainable and
            productive agriculture.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="text-muted-foreground hover:text-primary">Home</a></li>
            <li><a href="/about" className="text-muted-foreground hover:text-primary">About</a></li>
            <li><a href="/features" className="text-muted-foreground hover:text-primary">Features</a></li>
            <li><a href="/contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-6 w-6" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AgriMonitor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
