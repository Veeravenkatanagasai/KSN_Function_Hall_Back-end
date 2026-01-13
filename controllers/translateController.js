export const translate = async (req, res) => {
  try {
    const text = req.query.text;
    if (!text) {
      return res.status(400).json({ error: "Empty text" });
    }

    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|te`;

    const response = await fetch(apiUrl); // ✅ built-in fetch
    const json = await response.json();

    res.json({ te: json.responseData.translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
