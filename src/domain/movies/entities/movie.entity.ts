export interface MovieProps {
  id: string;
  userId: string;
  title: string;
  year: number;
  genre: string | null;
  director: string | null;
  rating: number | null;
  notes: string | null;
  watchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Movie {
  private props: MovieProps;

  private constructor(props: MovieProps) {
    this.props = props;
  }

  static create(props: Omit<MovieProps, 'createdAt' | 'updatedAt'>): Movie {
    const now = new Date();

    if (props.rating !== null && (props.rating < 1 || props.rating > 10)) {
      throw new Error('Rating must be between 1 and 10');
    }

    return new Movie({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: MovieProps): Movie {
    return new Movie(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get year(): number {
    return this.props.year;
  }

  get genre(): string | null {
    return this.props.genre;
  }

  get director(): string | null {
    return this.props.director;
  }

  get rating(): number | null {
    return this.props.rating;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get watchedAt(): Date {
    return this.props.watchedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateDetails(details: {
    title?: string;
    year?: number;
    genre?: string | null;
    director?: string | null;
  }): void {
    if (details.title !== undefined) {
      this.props.title = details.title;
    }
    if (details.year !== undefined) {
      this.props.year = details.year;
    }
    if (details.genre !== undefined) {
      this.props.genre = details.genre;
    }
    if (details.director !== undefined) {
      this.props.director = details.director;
    }
    this.touch();
  }

  updateRating(rating: number | null): void {
    if (rating !== null && (rating < 1 || rating > 10)) {
      throw new Error('Rating must be between 1 and 10');
    }
    this.props.rating = rating;
    this.touch();
  }

  updateNotes(notes: string | null): void {
    this.props.notes = notes;
    this.touch();
  }

  updateWatchedAt(date: Date): void {
    this.props.watchedAt = date;
    this.touch();
  }

  belongsToUser(userId: string): boolean {
    return this.props.userId === userId;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): MovieProps {
    return { ...this.props };
  }
}
