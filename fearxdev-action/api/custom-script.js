import JSZip from 'jszip';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { requirements, complexity, includeDatabase, includeUI, includeAdmin } = req.body;
    
    // Advanced AI-like parsing of requirements
    const parsedRequirements = parseRequirements(requirements);
    
    // Generate custom script based on complexity
    const files = generateCustomScript(parsedRequirements, {
      complexity,
      includeDatabase,
      includeUI,
      includeAdmin
    });
    
    // Create ZIP
    const zip = new JSZip();
    const folderName = `custom-script-${Date.now()}`;
    
    Object.entries(files).forEach(([path, content]) => {
      zip.file(`${folderName}/${path}`, content);
    });
    
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const fileName = `${folderName}.zip`;
    
    // Upload to file hosting
    const uploadResult = await uploadToFileHost(zipBuffer, fileName);
    
    // Count lines of code
    const totalLines = Object.values(files).reduce((total, content) => {
      return total + content.split('\n').length;
    }, 0);
    
    res.status(200).json({
      success: true,
      downloadUrl: uploadResult.downloadUrl,
      fileName: fileName,
      documentation: files['README.md'] || 'No documentation generated',
      estimatedLines: totalLines
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate custom script', details: error.message });
  }
}

function parseRequirements(requirements) {
  // Basic NLP-like parsing
  const keywords = {
    jobSystem: ['job', 'work', 'employment', 'career'],
    inventory: ['inventory', 'items', 'storage', 'container'],
    vehicle: ['car', 'vehicle', 'auto', 'transport'],
    admin: ['admin', 'management', 'control', 'moderate'],
    ui: ['interface', 'menu', 'gui', 'ui', 'display'],
    database: ['save', 'store', 'database', 'persistent', 'data']
  };
  
  const parsed = {
    type: 'custom',
    features: [],
    complexity: 'medium'
  };
  
  const lowerReq = requirements.toLowerCase();
  
  // Detect features based on keywords
  Object.entries(keywords).forEach(([feature, words]) => {
    if (words.some(word => lowerReq.includes(word))) {
      parsed.features.push(feature);
    }
  });
  
  return parsed;
}