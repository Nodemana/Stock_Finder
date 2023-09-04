const { fetchARXIVData, fetchMediaData, fetchFinanceData } = require('../utils/apiFetch');

const arxivToMarketAuxIndustries = {
    'astro-ph': 'Technology', // Astrophysics
    'cond-mat': 'Basic Materials', // Condensed Matter
    'cs': 'Technology', // Computer Science
    'econ': 'Financial Services', // Economics
    'eess': 'Industrials', // Electrical Engineering and Systems Science
    'gr-qc': 'Industrial Goods', // General Relativity and Quantum Cosmology
    'hep-ex': 'Industrials', // High Energy Physics - Experiment
    'hep-lat': 'Industrials', // High Energy Physics - Lattice
    'hep-ph': 'Industrials', // High Energy Physics - Phenomenology
    'hep-th': 'Industrials', // High Energy Physics - Theory
    'math': 'Financial Services', // Mathematics
    'nlin': 'Industrial Goods', // Nonlinear Sciences
    'nucl-ex': 'Energy', // Nuclear Experiment
    'nucl-th': 'Energy', // Nuclear Theory
    'physics': 'Industrial Goods', // Physics
    'q-bio': 'Healthcare', // Quantitative Biology
    'q-fin': 'Financial Services', // Quantitative Finance
    'quant-ph': 'Technology', // Quantum Physics
    'stat': 'Financial Services' // Statistics
  };

exports.performApiMashup = async (req, res) => {
  // req.body will contain the JSON payload sent from the frontend
  const { position, lookbackPeriod } = req.body;
 
  if (position !== '' && lookbackPeriod !== '') {
    try {

      // Wait for fetchARXIVData to complete and get the result
      let arxivResult = await fetchARXIVData(lookbackPeriod);
      // Get the corresponding industry from the result's category
      let industry = arxivToMarketAuxIndustries[arxivResult.mostPapersCategory];
      console.log(`For the Category ${arxivResult.mostPapersCategory} we got the industry ${industry} with ${arxivResult.mostPapers} total papers in ${lookbackPeriod} months`);
    
    
      let marketauxResult = await fetchMediaData(position, industry);

      // Respond back to the frontend with the new data
      res.json({
        message: 'Data received and processed',
        position,
        lookbackPeriod,
        industry,
        paperCount: result.paperCount
      });

    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  } else {
    // Respond back to the frontend with a message indicating that both fields are required
    res.status(400).json({
      message: 'Both position and lookbackPeriod are required.',
      position,
      lookbackPeriod
    });
  }
};