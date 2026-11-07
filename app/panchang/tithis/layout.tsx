/**
 * Marks every tithis page (index and detail) so app/styles/colour.css can give this
 * limb of the Panchang its own hue. The wrapper is display: contents, so it adds no box.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="panchang-limb" data-limb="tithis">
      {children}
    </div>
  );
}
