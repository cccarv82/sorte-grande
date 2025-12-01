/**
 * Wheeling System Types
 * 
 * Defines data structures for Wheeling System templates used in lottery suggestion generation.
 * Templates are pre-computed covering designs that guarantee conditional prizes.
 * 
 * @references
 * - Wikipedia: Covering Designs (https://en.wikipedia.org/wiki/Covering_design)
 * - Story 3.3: Implement Wheeling Templates Database
 * - Architecture Decision: Use TypeScript constants for templates (no DB overhead for MVP)
 */

/**
 * Supported lottery types in the system
 */
export type LotteryType = 'megasena' | 'lotofacil'

/**
 * Wheeling System guarantee specification
 * 
 * @example
 * { match: 4, prize: 4 } means "4 if 4" - if 4 of your numbers are drawn, 
 * you're guaranteed to match at least 4 numbers in one of your games (quadra)
 */
export type WheelGuarantee = {
  match: number    // How many numbers must be drawn from your wheel
  prize: number    // Minimum prize tier guaranteed (e.g., 4 = quadra, 5 = quina)
}

/**
 * Wheeling System template definition
 * 
 * Each template represents a pre-computed covering design with mathematical guarantees.
 * Templates use 0-based indices that get mapped to actual lottery numbers at generation time.
 * 
 * @example
 * const template: WheelTemplate = {
 *   id: "mega-8-4if4",
 *   name: "Mega Sena 8 números",
 *   lottery: "megasena",
 *   wheelSize: 8,
 *   gameSize: 6,
 *   guarantee: { match: 4, prize: 4 },
 *   combinations: [
 *     [0, 1, 2, 3, 4, 5],  // Maps to selected numbers at runtime
 *     [0, 1, 2, 6, 7, 3],
 *     // ... 26 more combinations
 *   ],
 *   totalGames: 28,
 *   source: "Wikipedia Covering Designs",
 *   costMultiplier: 28  // 28 games × R$ 5.00 = R$ 140.00
 * }
 */
export type WheelTemplate = {
  /**
   * Unique identifier for the template
   * Format: "{lottery}-{wheelSize}-{match}if{prize}"
   * @example "mega-8-4if4", "lotofacil-16-11if11"
   */
  id: string

  /**
   * Human-readable name displayed in UI
   * @example "Mega Sena 8 números", "Lotofácil 16 números"
   */
  name: string

  /**
   * Target lottery type
   */
  lottery: LotteryType

  /**
   * Total numbers in the wheel (numbers user selects)
   * @example 8 (for Mega Sena), 16 (for Lotofácil)
   */
  wheelSize: number

  /**
   * Numbers per game (lottery-specific)
   * @example 6 (Mega Sena), 15 (Lotofácil)
   */
  gameSize: number

  /**
   * Mathematical guarantee specification
   * @example { match: 4, prize: 4 } = "4 if 4" guarantee
   */
  guarantee: WheelGuarantee

  /**
   * Pre-computed combinations using 0-based indices
   * 
   * Indices reference positions in the user's selected numbers array.
   * At generation time, these get mapped to actual lottery numbers (1-60 for Mega, 1-25 for Lotofácil).
   * 
   * @example
   * User selects: [3, 12, 18, 27, 34, 45, 52, 58]
   * Combination: [0, 1, 2, 3, 4, 5]
   * Resulting game: [3, 12, 18, 27, 34, 45]
   */
  combinations: number[][]

  /**
   * Total number of games in this template
   * Used for cost calculation and UI display
   */
  totalGames: number

  /**
   * Reference source for the covering design
   * @example "Wikipedia Covering Designs", "Combinatorial Design Theory", "LaJolla Covering Repository"
   */
  source: string

  /**
   * Cost multiplier for quick calculation
   * totalGames value (used as multiplier for lottery base cost)
   * @example 28 games × R$ 5.00 (Mega Sena base) = R$ 140.00
   */
  costMultiplier: number
}

/**
 * Lottery configuration rules
 * Defines constraints and costs for each lottery type
 */
export type LotteryRules = {
  lottery: LotteryType
  name: string
  range: { min: number; max: number }  // Number range (e.g., 1-60 for Mega Sena)
  gameSize: number                      // Numbers per game
  minGameSize: number                   // Minimum numbers in a game
  maxGameSize: number                   // Maximum numbers in a game (for multiple bets)
  costBase: number                      // Base cost in cents (e.g., 500 = R$ 5.00)
  drawDays: number[]                    // Days of week (0=Sunday, 3=Wednesday, 6=Saturday)
}

/**
 * Result of wheeling system application
 * Generated dynamically when user creates a suggestion
 */
export type WheelResult = {
  template: WheelTemplate              // Template used
  selectedNumbers: number[]            // User's selected numbers (actual lottery numbers)
  games: Array<{
    numbers: number[]                  // Game numbers (sorted)
    cost: number                       // Cost in cents
  }>
  totalCost: number                    // Total cost in cents
  guarantee: string                    // Human-readable guarantee (e.g., "4 if 4")
}

/**
 * Template selection criteria
 * Used by auto-selection logic to pick optimal template
 */
export type TemplateSelectionCriteria = {
  lottery: LotteryType
  availableBudget: number              // Budget in cents
  preferredWheelSize?: number          // Optional: prefer specific wheel size
  maximizeGuarantee?: boolean          // Optional: prefer stronger guarantees
}
