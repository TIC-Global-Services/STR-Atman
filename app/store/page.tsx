import ComingSoon from "@/components/reuseable/ComingSoon";
import ContourBackground from "@/components/reuseable/ContourBackground";

const page = () => {
  return (
    <div>
      <ContourBackground
        background="#ffffff"
        lineColor="#7a825c"
        speed={0.03}
        resolution={20}
        levels={9}
      >
        <ComingSoon />
      </ContourBackground>
    </div>
  );
};

export default page;
