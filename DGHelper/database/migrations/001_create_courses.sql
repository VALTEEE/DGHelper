CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE, -- e.g. "tampere-dgc"
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  total_holes INTEGER NOT NULL,
  bounds JSONB NOT NULL
);

CREATE TABLE holes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  par INTEGER NOT NULL DEFAULT 3,
  distance_meters INTEGER DEFAULT 0,
  tee_pad JSONB NOT NULL,
  basket JSONB NOT NULL,
  fairway_path JSONB NOT NULL,
  ideal_throw JSONB,
  UNIQUE(course_id, number)
);

CREATE TABLE obstacles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hole_id UUID REFERENCES holes(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  shape VARCHAR(20) NOT NULL,
  points JSONB NOT NULL,
  severity VARCHAR(20) DEFAULT 'moderate',
  note TEXT
);

-- Indexes for fast lookups
CREATE INDEX idx_holes_course ON holes(course_id);
CREATE INDEX idx_obstacles_hole ON obstacles(hole_id);