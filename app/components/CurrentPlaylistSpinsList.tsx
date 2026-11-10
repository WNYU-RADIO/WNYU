import type { Spin } from '@wnyu/spinitron-sdk';

interface CurrentPlaylistSpinsProps {
  spins?: Spin[];
  dropdown?: boolean;
}
export default function CurrentPlaylistSpinsList({
  spins,
  dropdown = false,
}: CurrentPlaylistSpinsProps) {
  return (
    <div
      className={`my-8 border-2 ${dropdown ? 'border-white' : 'border-black'} overflow-y-scroll`}
    >
      {spins
        ? spins.map((spin) => (
            <div className="mx-auto flex gap-2 border-b" key={spin.id}>
              <p className="w-1/6 flex-shrink-0 text-lg">
                {new Date(spin.start).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>

              <p className="text-lg">
                {`${spin.song} - ${spin.artist}, ${spin.release} (${spin.label}) ${spin.released}`}
              </p>
            </div>
          ))
        : null}
    </div>
  );
}
