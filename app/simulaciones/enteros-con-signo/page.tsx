import { SectionShell } from "@/components/section-shell";
import { SignedZeroLineLab } from "@/components/signed-zero-line-lab";

export default function SignedIntegersPage() {
  return (
    <SectionShell
      eyebrow="simulacion 01"
      title="Linea de enteros con cero desplazable"
      description="Partimos desde cero: 16 cajas en horizontal, binarios fijos y un indicador deslizante que mueve el punto cero. Al moverlo, cambian los enteros visibles sin cambiar las etiquetas binarias."
    >
      <SignedZeroLineLab />
    </SectionShell>
  );
}