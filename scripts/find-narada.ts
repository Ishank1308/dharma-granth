import { scriptureCatalog } from '../data/scripture-meta';
console.log(scriptureCatalog.filter(s => s.id.includes('narada') || s.title.toLowerCase().includes('narada') || s.id.includes('puran')));
