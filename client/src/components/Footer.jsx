import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi';
import { FaTwitter, FaGithub, FaDiscord, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <HiSparkles className="text-white text-sm" />
              </div>
              <span className="font-poppins font-bold text-xl gradient-text">Pixora AI</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Transform your imagination into stunning AI-generated artwork. Create, explore, and share with the world.
            </p>
            <div className="flex items-center gap-4 mt-4">
              {[FaTwitter, FaGithub, FaDiscord, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-500 hover:text-violet-400 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Gallery', 'API'].map((item) => (
                <li key={item}>
                  <Link to="/pricing" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Privacy Policy', path: '#' },
                { label: 'Terms of Service', path: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-sm">© 2024 Pixora AI. All rights reserved.</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Powered by{' '}
            <span className="text-violet-400">Pollinations AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
