import { NextResponse } from "next/server";

const pexelsApiKey = "fSE05IOqv15hl4bKHmgKLLeINy46L99w7zJ2koMlD1xsTr4UiOzkEHtU";

function getSearchTerms(name: string, description: string): string[] {
  const terms: string[] = [];
  const cleanName = name.toLowerCase().trim();

  // 1. Direct name
  terms.push(name);

  // 2. Simplified name queries based on keywords in construction/supplies
  if (cleanName.includes("cement")) {
    terms.push("cement bag");
    terms.push("concrete construction");
  } else if (cleanName.includes("tmt") || cleanName.includes("steel") || cleanName.includes("wire") || cleanName.includes("rebar")) {
    terms.push("construction steel");
    terms.push("steel rebars");
    terms.push("metal rods");
  } else if (cleanName.includes("tile") || cleanName.includes("marble") || cleanName.includes("flooring")) {
    terms.push("floor tiles");
    terms.push("marble slab");
    terms.push("ceramic tiles");
  } else if (cleanName.includes("pipe") || cleanName.includes("plumbing")) {
    terms.push("plumbing pipes");
    terms.push("pvc pipes");
  } else if (cleanName.includes("switch") || cleanName.includes("wire") || cleanName.includes("electrical")) {
    terms.push("light switch");
    terms.push("electrical wiring");
  } else if (cleanName.includes("paint") || cleanName.includes("primer") || cleanName.includes("finish")) {
    terms.push("paint bucket");
    terms.push("wall painting");
  } else if (cleanName.includes("lock") || cleanName.includes("hinge") || cleanName.includes("hardware")) {
    terms.push("door lock");
    terms.push("door hinge");
  } else if (cleanName.includes("wood") || cleanName.includes("plywood") || cleanName.includes("veneer")) {
    terms.push("wood texture");
    terms.push("plywood boards");
  }

  // 3. Fallback generic terms
  terms.push("construction materials");
  terms.push("building tools");
  
  return terms;
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const searchTerms = getSearchTerms(name, description || "");
    let imageUrl = "";
    let selectedTerm = "";

    for (const term of searchTerms) {
      console.log(`Searching Pexels for query: "${term}"`);
      try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=1`, {
          headers: {
            "Authorization": pexelsApiKey,
            "Accept": "application/json"
          }
        });
        
        if (response.ok) {
          const searchResult = await response.json();
          if (searchResult.photos && searchResult.photos.length > 0) {
            const pexelsPhotoData = searchResult.photos[0];
            imageUrl = pexelsPhotoData.src.large || pexelsPhotoData.src.original || pexelsPhotoData.src.medium;
            selectedTerm = term;
            console.log(`Found photo on Pexels for "${term}":`, imageUrl);
            break; // Stop on first successful match
          }
        }
      } catch (err) {
        console.error(`Error fetching Pexels search for "${term}":`, err);
      }
    }

    if (!imageUrl) {
      // High quality fallback construction image if everything else failed
      imageUrl = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop";
      selectedTerm = "fallback";
    }

    return NextResponse.json({
      prompt: selectedTerm,
      imageUrl: imageUrl,
    });
  } catch (error: any) {
    console.error("Error in generate-image route:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
