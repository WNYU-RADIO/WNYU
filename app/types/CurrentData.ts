import type {
  Playlist,
  Show,
  Spin,
  SpinitronMetadata,
} from '@wnyu/spinitron-sdk';

interface CurrentData {
  playlist?: Playlist;
  spins?: Spin[];
  metadata?: SpinitronMetadata;
  show?: Show | null;
}

export type { CurrentData };
