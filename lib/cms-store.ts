import type { Collection, CollectionItem, Field, CMSStats } from "@/lib/types"

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

// Initial collections data with the 4 requested collections
const initialCollections: Collection[] = [
  {
    id: "col_players",
    name: "Players",
    slug: "players",
    fields: [
      { id: "f1", name: "Name", key: "name", type: "text", required: true },
      { id: "f2", name: "Position", key: "position", type: "text", required: true },
      { id: "f3", name: "Team", key: "team", type: "text", required: false },
      { id: "f4", name: "Overall Rating", key: "overall_rating", type: "number", required: true },
      { id: "f5", name: "Nationality", key: "nationality", type: "text", required: false },
      { id: "f6", name: "Photo", key: "photo", type: "image", required: false },
      { id: "f7", name: "Age", key: "age", type: "number", required: false },
      { id: "f8", name: "Active", key: "active", type: "boolean", required: false },
    ],
    itemCount: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "col_cards",
    name: "Cards",
    slug: "cards",
    fields: [
      { id: "f1", name: "Card Name", key: "card_name", type: "text", required: true },
      { id: "f2", name: "Player", key: "player", type: "reference", required: true },
      { id: "f3", name: "Card Type", key: "card_type", type: "text", required: true },
      { id: "f4", name: "Rating", key: "rating", type: "number", required: true },
      { id: "f5", name: "Card Image", key: "card_image", type: "image", required: false },
      { id: "f6", name: "Release Date", key: "release_date", type: "date", required: false },
      { id: "f7", name: "Is Special", key: "is_special", type: "boolean", required: false },
      { id: "f8", name: "Price", key: "price", type: "number", required: false },
    ],
    itemCount: 3,
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "col_renders",
    name: "Renders",
    slug: "renders",
    fields: [
      { id: "f1", name: "Title", key: "title", type: "text", required: true },
      { id: "f2", name: "Player", key: "player", type: "reference", required: true },
      { id: "f3", name: "Image URL", key: "image_url", type: "image", required: true },
      { id: "f4", name: "Category", key: "category", type: "text", required: false },
      { id: "f5", name: "Description", key: "description", type: "richtext", required: false },
      { id: "f6", name: "Is Featured", key: "is_featured", type: "boolean", required: false },
    ],
    itemCount: 2,
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "col_player_reviews",
    name: "Player Reviews",
    slug: "player-reviews",
    fields: [
      // Required fields
      { id: "f1", name: "Owner ID", key: "ownerId", type: "text", required: true },
      { id: "f2", name: "Player Name", key: "playerName", type: "text", required: true },
      { id: "f3", name: "Event Name", key: "eventName", type: "text", required: true },
      { id: "f4", name: "Pros", key: "pros", type: "text", required: true },
      { id: "f5", name: "Cons", key: "cons", type: "text", required: true },
      { id: "f6", name: "Verdict", key: "verdict", type: "text", required: true },
      { id: "f7", name: "Rating", key: "rating", type: "number", required: true },
      { id: "f8", name: "Stats 1", key: "stats1", type: "number", required: true },
      { id: "f9", name: "Stats 2", key: "stats2", type: "number", required: true },
      { id: "f10", name: "Stats 3", key: "stats3", type: "number", required: true },
      { id: "f11", name: "Stats 4", key: "stats4", type: "number", required: true },
      { id: "f12", name: "Stats 5", key: "stats5", type: "number", required: true },
      { id: "f13", name: "Stats 6", key: "stats6", type: "number", required: true },
      { id: "f14", name: "St Type 1", key: "st_type1", type: "text", required: true },
      { id: "f15", name: "St Type 2", key: "st_type2", type: "text", required: true },
      { id: "f16", name: "St Type 3", key: "st_type3", type: "text", required: true },
      { id: "f17", name: "St Type 4", key: "st_type4", type: "text", required: true },
      { id: "f18", name: "St Type 5", key: "st_type5", type: "text", required: true },
      { id: "f19", name: "St Type 6", key: "st_type6", type: "text", required: true },
      // Optional fields
      { id: "f20", name: "Image Review", key: "imageReview", type: "text", required: false },
      { id: "f21", name: "Reviewee", key: "reviewee", type: "text", required: false },
      { id: "f22", name: "Alt 1", key: "alt1", type: "text", required: false },
      { id: "f23", name: "Alt 2", key: "alt2", type: "text", required: false },
      { id: "f24", name: "Alt 3", key: "alt3", type: "text", required: false },
      { id: "f25", name: "R Link", key: "rlink", type: "text", required: false },
      { id: "f26", name: "Player Reviews Players", key: "playerReviews_players", type: "text", required: false },
      { id: "f27", name: "URL Review", key: "urlReview", type: "text", required: false },
      { id: "f28", name: "Partner ID", key: "partnerId", type: "text", required: false },
      { id: "f29", name: "Partner Name", key: "partnerName", type: "text", required: false },
      { id: "f30", name: "Partner URL", key: "partnerUrl", type: "text", required: false },
      { id: "f31", name: "Player Reviews List", key: "playerReviews_list", type: "text", required: false },
      { id: "f32", name: "Player Reviews Item", key: "playerReviews_item", type: "text", required: false },
      { id: "f33", name: "Skill Image 1", key: "skillImage1", type: "text", required: false },
      { id: "f34", name: "Skill Image 2", key: "skillImage2", type: "text", required: false },
      { id: "f35", name: "Skill Image 3", key: "skillImage3", type: "text", required: false },
      { id: "f36", name: "Skill Image 4", key: "skillImage4", type: "text", required: false },
      { id: "f37", name: "Skill Image 5", key: "skillImage5", type: "text", required: false },
      { id: "f38", name: "Skill Image 6", key: "skillImage6", type: "text", required: false },
      { id: "f39", name: "Skill 1", key: "skill1", type: "text", required: false },
      { id: "f40", name: "Skill 2", key: "skill2", type: "text", required: false },
      { id: "f41", name: "Skill 3", key: "skill3", type: "text", required: false },
      { id: "f42", name: "Skill 4", key: "skill4", type: "text", required: false },
      { id: "f43", name: "Skill 5", key: "skill5", type: "text", required: false },
      { id: "f44", name: "Skill 6", key: "skill6", type: "text", required: false },
      { id: "f45", name: "WF 1", key: "wf_1", type: "text", required: false },
      { id: "f46", name: "SM 1", key: "sm1", type: "text", required: false },
      { id: "f47", name: "ST 1", key: "st1", type: "text", required: false },
      { id: "f48", name: "Position", key: "pos", type: "text", required: false },
      { id: "f49", name: "Rev Cred", key: "rev_cred", type: "text", required: false },
      { id: "f50", name: "Rev Cred URL", key: "rev_cred_url", type: "text", required: false },
      { id: "f51", name: "URL Slug Copy", key: "urlSlugCopy", type: "text", required: false },
    ],
    itemCount: 5,
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: new Date().toISOString(),
  },
]

// Initial items data
const initialItems: CollectionItem[] = [
  // Players
  {
    id: "item_p1",
    collectionId: "col_players",
    data: {
      name: "Lionel Messi",
      position: "RW",
      team: "Inter Miami",
      overall_rating: 91,
      nationality: "Argentina",
      photo: "/messi-football-player.jpg",
      age: 36,
      active: true,
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_p2",
    collectionId: "col_players",
    data: {
      name: "Cristiano Ronaldo",
      position: "ST",
      team: "Al Nassr",
      overall_rating: 88,
      nationality: "Portugal",
      photo: "/ronaldo-football-player.jpg",
      age: 39,
      active: true,
    },
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_p3",
    collectionId: "col_players",
    data: {
      name: "Kylian Mbappe",
      position: "ST",
      team: "Real Madrid",
      overall_rating: 91,
      nationality: "France",
      photo: "/mbappe-football-player.jpg",
      age: 25,
      active: true,
    },
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_p4",
    collectionId: "col_players",
    data: {
      name: "Erling Haaland",
      position: "ST",
      team: "Manchester City",
      overall_rating: 91,
      nationality: "Norway",
      photo: "/haaland-football-player.jpg",
      age: 24,
      active: true,
    },
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  // Cards
  {
    id: "item_c1",
    collectionId: "col_cards",
    data: {
      card_name: "TOTY Messi",
      player: "Lionel Messi",
      card_type: "Team of the Year",
      rating: 98,
      card_image: "/toty-messi-football-card.jpg",
      release_date: "2024-01-20",
      is_special: true,
      price: 5000000,
    },
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_c2",
    collectionId: "col_cards",
    data: {
      card_name: "TOTS Haaland",
      player: "Erling Haaland",
      card_type: "Team of the Season",
      rating: 99,
      card_image: "/tots-haaland-football-card.jpg",
      release_date: "2024-05-15",
      is_special: true,
      price: 8000000,
    },
    createdAt: "2024-02-11T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_c3",
    collectionId: "col_cards",
    data: {
      card_name: "Icon Ronaldo",
      player: "Cristiano Ronaldo",
      card_type: "Icon",
      rating: 95,
      card_image: "/icon-ronaldo-football-card.jpg",
      release_date: "2024-03-10",
      is_special: true,
      price: 3500000,
    },
    createdAt: "2024-02-12T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  // Renders
  {
    id: "item_r1",
    collectionId: "col_renders",
    data: {
      title: "Messi Celebration",
      player: "Lionel Messi",
      image_url: "/messi-celebration-render.jpg",
      category: "Celebrations",
      description: "<p>Iconic Messi celebration render with arms wide open</p>",
      is_featured: true,
    },
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_r2",
    collectionId: "col_renders",
    data: {
      title: "Haaland Goal",
      player: "Erling Haaland",
      image_url: "/haaland-goal-celebration-render.jpg",
      category: "Goals",
      description: "<p>Haaland meditation celebration render</p>",
      is_featured: true,
    },
    createdAt: "2024-03-06T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  // Player Reviews
  {
    id: "item_pr1",
    collectionId: "col_player_reviews",
    data: {
      ownerId: "user_123",
      playerName: "Lionel Messi",
      eventName: "Champions League Final",
      imageReview: "https://example.com/messi-review.jpg",
      reviewee: "Expert Analyst",
      alt1: "Messi celebrating",
      alt2: "Messi dribbling",
      alt3: "Messi passing",
      pros: "Incredible dribbling, vision, and playmaking ability",
      cons: "Slightly reduced pace compared to prime years",
      verdict: "Still the GOAT - unmatched football IQ and technical ability",
      rating: 9.5,
      rlink: "https://example.com/messi",
      playerReviews_players: "messi_id_123",
      urlReview: "https://example.com/reviews/messi",
      partnerId: "partner_001",
      partnerName: "FC Barcelona",
      partnerUrl: "https://fcbarcelona.com",
      playerReviews_list: "top_players_2024",
      playerReviews_item: "item_messi_001",
      stats1: 95,
      stats2: 88,
      stats3: 96,
      stats4: 97,
      stats5: 40,
      stats6: 75,
      st_type1: "Pace",
      st_type2: "Shooting",
      st_type3: "Passing",
      st_type4: "Dribbling",
      st_type5: "Defending",
      st_type6: "Physical",
      skillImage1: "https://example.com/skill1.jpg",
      skillImage2: "https://example.com/skill2.jpg",
      skillImage3: "https://example.com/skill3.jpg",
      skillImage4: "https://example.com/skill4.jpg",
      skillImage5: "https://example.com/skill5.jpg",
      skillImage6: "https://example.com/skill6.jpg",
      skill1: "Dribbling",
      skill2: "Free Kicks",
      skill3: "Vision",
      skill4: "Finishing",
      skill5: "Passing",
      skill6: "Ball Control",
      wf_1: "Left",
      sm1: "5 Star",
      st1: "CF",
      pos: "RW",
      rev_cred: "Professional Analyst",
      rev_cred_url: "https://example.com/analyst",
      urlSlugCopy: "messi-champions-league-final-review",
    },
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_pr2",
    collectionId: "col_player_reviews",
    data: {
      ownerId: "user_456",
      playerName: "Erling Haaland",
      eventName: "Premier League Season",
      imageReview: "https://example.com/haaland-review.jpg",
      reviewee: "Sports Journalist",
      alt1: "Haaland scoring",
      alt2: "Haaland celebrating",
      alt3: "Haaland running",
      pros: "Unstoppable in front of goal, incredible positioning",
      cons: "Limited playmaking, needs service from teammates",
      verdict: "Pure goal machine - one of the best strikers in the world",
      rating: 9.0,
      rlink: "https://example.com/haaland",
      playerReviews_players: "haaland_id_456",
      urlReview: "https://example.com/reviews/haaland",
      partnerId: "partner_002",
      partnerName: "Manchester City",
      partnerUrl: "https://mancity.com",
      playerReviews_list: "top_strikers_2024",
      playerReviews_item: "item_haaland_002",
      stats1: 92,
      stats2: 96,
      stats3: 70,
      stats4: 82,
      stats5: 45,
      stats6: 95,
      st_type1: "Pace",
      st_type2: "Shooting",
      st_type3: "Passing",
      st_type4: "Dribbling",
      st_type5: "Defending",
      st_type6: "Physical",
      skillImage1: "https://example.com/h-skill1.jpg",
      skillImage2: "https://example.com/h-skill2.jpg",
      skillImage3: "https://example.com/h-skill3.jpg",
      skillImage4: "https://example.com/h-skill4.jpg",
      skillImage5: "https://example.com/h-skill5.jpg",
      skillImage6: "https://example.com/h-skill6.jpg",
      skill1: "Finishing",
      skill2: "Positioning",
      skill3: "Heading",
      skill4: "Strength",
      skill5: "Speed",
      skill6: "Shot Power",
      wf_1: "Left",
      sm1: "3 Star",
      st1: "ST",
      pos: "ST",
      rev_cred: "Premier League Expert",
      rev_cred_url: "https://example.com/pl-expert",
      urlSlugCopy: "haaland-premier-league-season-review",
    },
    createdAt: "2024-04-21T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_pr3",
    collectionId: "col_player_reviews",
    data: {
      ownerId: "user_789",
      playerName: "Kylian Mbappe",
      eventName: "World Cup 2022",
      imageReview: "https://example.com/mbappe-review.jpg",
      reviewee: "World Cup Analyst",
      alt1: "Mbappe sprint",
      alt2: "Mbappe goal",
      alt3: "Mbappe celebration",
      pros: "Lightning speed, clinical finishing, excellent dribbling",
      cons: "Can be inconsistent in big games",
      verdict: "Future GOAT candidate - incredible talent and potential",
      rating: 9.2,
      rlink: "https://example.com/mbappe",
      playerReviews_players: "mbappe_id_789",
      urlReview: "https://example.com/reviews/mbappe",
      partnerId: "partner_003",
      partnerName: "PSG",
      partnerUrl: "https://psg.fr",
      playerReviews_list: "world_cup_stars_2022",
      playerReviews_item: "item_mbappe_003",
      stats1: 98,
      stats2: 92,
      stats3: 85,
      stats4: 94,
      stats5: 38,
      stats6: 80,
      st_type1: "Pace",
      st_type2: "Shooting",
      st_type3: "Passing",
      st_type4: "Dribbling",
      st_type5: "Defending",
      st_type6: "Physical",
      skillImage1: "https://example.com/m-skill1.jpg",
      skillImage2: "https://example.com/m-skill2.jpg",
      skillImage3: "https://example.com/m-skill3.jpg",
      skillImage4: "https://example.com/m-skill4.jpg",
      skillImage5: "https://example.com/m-skill5.jpg",
      skillImage6: "https://example.com/m-skill6.jpg",
      skill1: "Speed",
      skill2: "Dribbling",
      skill3: "Finishing",
      skill4: "Acceleration",
      skill5: "Agility",
      skill6: "Shot Power",
      wf_1: "Right",
      sm1: "5 Star",
      st1: "ST",
      pos: "LW",
      rev_cred: "FIFA World Cup Analyst",
      rev_cred_url: "https://example.com/wc-analyst",
      urlSlugCopy: "mbappe-world-cup-2022-review",
    },
    createdAt: "2024-04-22T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_pr4",
    collectionId: "col_player_reviews",
    data: {
      ownerId: "user_101",
      playerName: "Kevin De Bruyne",
      eventName: "Premier League 2023-24",
      imageReview: "https://example.com/kdb-review.jpg",
      reviewee: "Tactical Analyst",
      alt1: "KDB passing",
      alt2: "KDB assisting",
      alt3: "KDB celebrating",
      pros: "Best passer in the world, incredible vision and creativity",
      cons: "Injury prone, defensive contribution could be better",
      verdict: "World-class playmaker - the engine of Manchester City",
      rating: 9.3,
      rlink: "https://example.com/debruyne",
      playerReviews_players: "kdb_id_101",
      urlReview: "https://example.com/reviews/kdb",
      partnerId: "partner_002",
      partnerName: "Manchester City",
      partnerUrl: "https://mancity.com",
      playerReviews_list: "top_midfielders_2024",
      playerReviews_item: "item_kdb_004",
      stats1: 78,
      stats2: 88,
      stats3: 98,
      stats4: 90,
      stats5: 65,
      stats6: 82,
      st_type1: "Pace",
      st_type2: "Shooting",
      st_type3: "Passing",
      st_type4: "Dribbling",
      st_type5: "Defending",
      st_type6: "Physical",
      skillImage1: "https://example.com/kdb-skill1.jpg",
      skillImage2: "https://example.com/kdb-skill2.jpg",
      skillImage3: "https://example.com/kdb-skill3.jpg",
      skillImage4: "https://example.com/kdb-skill4.jpg",
      skillImage5: "https://example.com/kdb-skill5.jpg",
      skillImage6: "https://example.com/kdb-skill6.jpg",
      skill1: "Passing",
      skill2: "Vision",
      skill3: "Crossing",
      skill4: "Long Shots",
      skill5: "Free Kicks",
      skill6: "Playmaking",
      wf_1: "Left",
      sm1: "4 Star",
      st1: "CAM",
      pos: "CM",
      rev_cred: "Premier League Tactical Expert",
      rev_cred_url: "https://example.com/tactical-expert",
      urlSlugCopy: "kevin-de-bruyne-premier-league-review",
    },
    createdAt: "2024-04-23T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_pr5",
    collectionId: "col_player_reviews",
    data: {
      ownerId: "user_202",
      playerName: "Vinicius Junior",
      eventName: "Champions League 2023-24",
      imageReview: "https://example.com/vini-review.jpg",
      reviewee: "Champions League Scout",
      alt1: "Vini dribbling",
      alt2: "Vini scoring",
      alt3: "Vini celebrating",
      pros: "Explosive pace, excellent dribbling, improving end product",
      cons: "Decision making can be questionable, needs to be more clinical",
      verdict: "Rising star - one of the most exciting wingers in world football",
      rating: 8.8,
      rlink: "https://example.com/vinicius",
      playerReviews_players: "vini_id_202",
      urlReview: "https://example.com/reviews/vinicius",
      partnerId: "partner_004",
      partnerName: "Real Madrid",
      partnerUrl: "https://realmadrid.com",
      playerReviews_list: "rising_stars_2024",
      playerReviews_item: "item_vini_005",
      stats1: 96,
      stats2: 85,
      stats3: 82,
      stats4: 95,
      stats5: 35,
      stats6: 72,
      st_type1: "Pace",
      st_type2: "Shooting",
      st_type3: "Passing",
      st_type4: "Dribbling",
      st_type5: "Defending",
      st_type6: "Physical",
      skillImage1: "https://example.com/vini-skill1.jpg",
      skillImage2: "https://example.com/vini-skill2.jpg",
      skillImage3: "https://example.com/vini-skill3.jpg",
      skillImage4: "https://example.com/vini-skill4.jpg",
      skillImage5: "https://example.com/vini-skill5.jpg",
      skillImage6: "https://example.com/vini-skill6.jpg",
      skill1: "Dribbling",
      skill2: "Pace",
      skill3: "Acceleration",
      skill4: "Agility",
      skill5: "Flair",
      skill6: "Crossing",
      wf_1: "Right",
      sm1: "5 Star",
      st1: "LW",
      pos: "LW",
      rev_cred: "La Liga & UCL Analyst",
      rev_cred_url: "https://example.com/laliga-analyst",
      urlSlugCopy: "vinicius-junior-champions-league-review",
    },
    createdAt: "2024-04-24T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
]

// In-memory store (simulating database)
const collections: Collection[] = [...initialCollections]
let items: CollectionItem[] = [...initialItems]

// Collection CRUD operations
export function getCollections(): Collection[] {
  return collections
}

export function getCollection(id: string): Collection | undefined {
  return collections.find((c) => c.id === id)
}

export function createCollection(data: { name: string; slug: string; fields: Omit<Field, "id">[] }): Collection {
  const now = new Date().toISOString()
  const newCollection: Collection = {
    id: `col_${generateId()}`,
    name: data.name,
    slug: data.slug,
    fields: data.fields.map((f) => ({ ...f, id: `f_${generateId()}` })),
    itemCount: 0,
    createdAt: now,
    updatedAt: now,
  }
  collections.push(newCollection)
  return newCollection
}

export function updateCollection(
  id: string,
  data: Partial<{ name: string; slug: string; fields: Omit<Field, "id">[] }>,
): Collection | null {
  const index = collections.findIndex((c) => c.id === id)
  if (index === -1) return null

  const existing = collections[index]
  const updated: Collection = {
    ...existing,
    ...data,
    fields: data.fields ? data.fields.map((f) => ({ ...f, id: `f_${generateId()}` })) : existing.fields,
    updatedAt: new Date().toISOString(),
  }
  collections[index] = updated
  return updated
}

export function deleteCollection(id: string): boolean {
  const index = collections.findIndex((c) => c.id === id)
  if (index === -1) return false

  collections.splice(index, 1)
  // Delete associated items
  items = items.filter((i) => i.collectionId !== id)
  return true
}

// Items CRUD operations
export function getItems(collectionId: string): CollectionItem[] {
  return items.filter((i) => i.collectionId === collectionId)
}

export function getItem(id: string): CollectionItem | undefined {
  return items.find((i) => i.id === id)
}

export function createItem(collectionId: string, data: Record<string, unknown>): CollectionItem {
  const now = new Date().toISOString()
  const newItem: CollectionItem = {
    id: `item_${generateId()}`,
    collectionId,
    data,
    createdAt: now,
    updatedAt: now,
  }
  items.push(newItem)

  // Update collection item count
  const collection = collections.find((c) => c.id === collectionId)
  if (collection) {
    collection.itemCount = items.filter((i) => i.collectionId === collectionId).length
    collection.updatedAt = now
  }

  return newItem
}

export function updateItem(id: string, data: Record<string, unknown>): CollectionItem | null {
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null

  const updated: CollectionItem = {
    ...items[index],
    data,
    updatedAt: new Date().toISOString(),
  }
  items[index] = updated
  return updated
}

export function deleteItem(id: string): boolean {
  const item = items.find((i) => i.id === id)
  if (!item) return false

  const collectionId = item.collectionId
  items = items.filter((i) => i.id !== id)

  // Update collection item count
  const collection = collections.find((c) => c.id === collectionId)
  if (collection) {
    collection.itemCount = items.filter((i) => i.collectionId === collectionId).length
    collection.updatedAt = new Date().toISOString()
  }

  return true
}

// Field operations
export function addFieldToCollection(collectionId: string, field: Omit<Field, "id">): Field | null {
  const collection = collections.find((c) => c.id === collectionId)
  if (!collection) return null

  const newField: Field = {
    ...field,
    id: `f_${generateId()}`,
  }
  collection.fields.push(newField)
  collection.updatedAt = new Date().toISOString()
  return newField
}

export function updateField(collectionId: string, fieldId: string, data: Partial<Field>): Field | null {
  const collection = collections.find((c) => c.id === collectionId)
  if (!collection) return null

  const fieldIndex = collection.fields.findIndex((f) => f.id === fieldId)
  if (fieldIndex === -1) return null

  const updatedField: Field = {
    ...collection.fields[fieldIndex],
    ...data,
    id: fieldId, // Preserve the original ID
  }
  collection.fields[fieldIndex] = updatedField
  collection.updatedAt = new Date().toISOString()
  return updatedField
}

export function deleteField(collectionId: string, fieldId: string): boolean {
  const collection = collections.find((c) => c.id === collectionId)
  if (!collection) return false

  const fieldIndex = collection.fields.findIndex((f) => f.id === fieldId)
  if (fieldIndex === -1) return false

  collection.fields.splice(fieldIndex, 1)
  collection.updatedAt = new Date().toISOString()

  // Remove field data from all items in this collection
  items
    .filter((item) => item.collectionId === collectionId)
    .forEach((item) => {
      const field = Object.keys(item.data).find((key) => {
        // Find the field key that matches this field
        const matchingField = collection.fields.find((f) => f.key === key)
        return !matchingField
      })
      if (field) {
        delete item.data[field]
      }
    })

  return true
}

// Stats
export function getCMSStats(): CMSStats {
  const totalItems = collections.reduce((sum, c) => sum + c.itemCount, 0)
  return {
    totalItems,
    itemLimit: 4000,
    totalCollections: collections.length,
  }
}
