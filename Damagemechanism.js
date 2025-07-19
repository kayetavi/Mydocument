// DamageMechanism.js
const damageMechanisms = {
  "1": {
    name: "Sulfidation",
    description: `
<ul>
  <li>Corrosion of carbon steel and other alloys due to reaction with sulfur compounds at high temperatures.</li>
  <li>This refers to sulfidation without hydrogen; with hydrogen is covered under High-temperature H₂/H₂S corrosion.</li>
  <li>Also known as sulfidic corrosion.</li>
  <li>Typically produces a smooth, uniformly corroded surface.</li>
  <li>May result in rupture-type failures rather than localized pinhole leaks.</li>
  <li>For comprehensive guidance, refer to API 939-C.</li>
</ul>
    `,
    affectedMaterials: `
<ul>
  <li>All iron-based materials:
    <ul>
      <li>Carbon steel (most susceptible)</li>
      <li>Low-alloy steels</li>
      <li>400 series stainless steels</li>
      <li>300 series stainless steels (less susceptible)</li>
    </ul>
  </li>
  <li>Nickel-based alloys — affected depending on chromium content; at >1193 °F (645 °C), high-nickel alloys may suffer sub-surface nickel sulfide formation (a.k.a. hot corrosion).</li>
  <li>Susceptibility increases with nickel content.</li>
  <li>Copper-based alloys — form sulfide corrosion products at lower temperatures than carbon steel.</li>
</ul>
    `,
    criticalFactors: `
<ul>
  <li>Key factors influencing sulfidation:
    <ul>
      <li>Metal composition</li>
      <li>Temperature</li>
      <li>Concentration of reactive sulfur compounds</li>
      <li>Flow conditions (can increase corrosion rate)</li>
    </ul>
  </li>
  <li>Resistance to sulfidation improves with increasing chromium content in iron-based and nickel-based alloys.</li>
  <li>300 series stainless steels (e.g., 304, 316, 321, 347) are highly resistant under most refining conditions.</li>
  <li>Nickel-based alloys require sufficient chromium; low-chromium nickel alloys are poor in sulfidation resistance.</li>
  <li>Carbon steel’s silicon content affects corrosion rate:
    <ul>
      <li>Steels with Si ≥ 0.10% (e.g., A106) show better resistance.</li>
      <li>Low-Si steels (e.g., A53) have higher and variable corrosion rates.</li>
    </ul>
  </li>
  <li>Metal loss is impacted by sulfide scale properties:
    <ul>
      <li>Protective if the scale is dense, adherent, and continuous.</li>
      <li>Less protective in turbulent or chemically aggressive flows.</li>
    </ul>
  </li>
  <li>Sulfidation generally begins at metal temperatures &gt; 450 °F (230 °C), but practical concern arises above 500 °F (260 °C).</li>
  <li>Crude oils and hydrocarbons contain a variety of sulfur species; not all contribute equally to sulfidation.</li>
  <li>H₂S and other thermally-decomposed sulfur species are most responsible for high-temperature sulfidation.</li>
  <li>Weight % sulfur alone is not always reliable in predicting corrosion risk.</li>
</ul>
    `,
    affectedUnits: `
<ul>
  <li>Sulfidation occurs in piping and equipment exposed to high-temperature sulfur-containing liquid, vapor, or mixed-phase streams.</li>
  <li>Commonly affected process units:
    <ul>
      <li>Crude distillation units</li>
      <li>Vacuum distillation units</li>
      <li>Fluid catalytic cracking (FCC) units</li>
      <li>Coker units</li>
      <li>Visbreaker units</li>
      <li>Hydroprocessing unit feed sections (before hydrogen injection)</li>
    </ul>
  </li>
  <li>In hydroprocessing units, once hydrogen is introduced, high-temperature H₂/H₂S corrosion becomes the dominant mechanism.</li>
  <li>Coker heaters made from high-nickel alloys (e.g., Alloy 800H) have shown accelerated sulfidation in lower radiant sections operating &gt; 1193 °F (645 °C).</li>
  <li>Heaters fired with oil, gas, or coke may be susceptible depending on the sulfur content of the fuel.</li>
  <li>Most heaters now use low-sulfur gas to comply with environmental regulations, especially in the U.S.</li>
</ul>
    `,
    appearance: `
<ul>
  <li>Corrosion typically appears as uniform metal thinning but may also present as localized or erosion-corrosion damage in high-velocity areas.</li>
  <li>Thinning is generally uniform but can vary greatly within the same system or along a piping run.</li>
  <li>Marked difference in wall loss may be seen between low-silicon (&lt; 0.10% Si) and high-silicon (≥ 0.10% Si) pipe sections, often visible as step changes in wall thickness.</li>
  <li>Surfaces are typically covered with sulfide scale.</li>
  <li>Scale thickness depends on:
    <ul>
      <li>Alloy composition</li>
      <li>Corrosiveness of the process stream</li>
      <li>Flow regime and fluid velocity</li>
    </ul>
  </li>
</ul>
    `,
    mitigation: `
<ul>
  <li>Upgrade to higher-chromium materials (e.g., 9Cr-1Mo) to improve sulfidation resistance.</li>
  <li>Use solid or clad (or overlaid) 300 series stainless steels for strong corrosion resistance.</li>
  <li>400 series stainless steel cladding can improve performance over carbon steel, but solid 400 SS is typically avoided due to embrittlement risks.</li>
  <li>Aluminum diffusion coatings on carbon and low-alloy steels can reduce sulfidation and scale, but may not provide full protection.</li>
  <li>For temperatures above 1193 °F (645 °C), select higher-nickel alloys with lower Ni content to reduce sulfidation rates.</li>
</ul>
    `,
    temperatureComparison: `
<ul>
  <li><strong>High-Temperature Sulfidation Onset:</strong>
    <ul>
      <li>API 571: Starts above 450 °F (230 °C), practical concern above 500 °F (260 °C)</li>
      <li>API 581: Starts above 450 °F (232 °C)</li>
      <li><em>Difference:</em> 571 adds practical threshold of 500 °F (260 °C) for inspection focus</li>
    </ul>
  </li>
  <li><strong>Naphthenic Acid Corrosion (NAC) Range:</strong>
    <ul>
      <li>API 571: Not explicitly defined here, assumed 450–800 °F (232–427 °C)</li>
      <li>API 581: 450–800 °F (232–427 °C); ceases above 800 °F due to acid breakdown or vaporization</li>
      <li><em>Difference:</em> Temperature range aligns; 581 clearly defines upper cutoff at 800 °F</li>
    </ul>
  </li>
  <li><strong>NAC + Sulfidation Overlap:</strong>
    <ul>
      <li>API 581: Both mechanisms may be active in the 450–800 °F (232–427 °C) range</li>
      <li>API 571: Highlights that NAC occurs only in liquid phase; sulfidation occurs in both phases</li>
      <li><em>Note:</em> NAC may be more severe at low sulfur levels due to lack of protective sulfides</li>
    </ul>
  </li>
</ul>
    `,
    inspection: `
<ul>
  <li>Use UT thickness measurement or RT to detect and measure thinning in piping, tubing, and equipment.</li>
  <li>For pressure vessels and large piping, internal VT followed by UT is useful if access is available.</li>
  <li>Permanently mounted thickness monitoring sensors can provide continuous monitoring.</li>
  <li>Use UT or smart pigging for heater tubes; smart pigging offers better coverage and detection than spot UT.</li>
  <li>Verify actual operating temperatures and compare them to design; monitor sulfur levels for increases.</li>
  <li>Temperature monitoring can be done using tube-skin thermocouples or infrared thermography.</li>
  <li>Use proactive and retroactive MVPs (Materials Verification Programs) to verify alloy type and detect mix-ups (see API 578).</li>
  <li>Many refiners use wall thickness checks on carbon steel piping in sulfidation service to identify low-silicon components.</li>
  <li>Some refiners use PMI-type testing to determine silicon content in vulnerable piping systems.</li>
</ul>
    `,
    imagePath: "image/sulfidation.png"
  },
  // Add more damage mechanisms here using keys: "2", "3", ...
};
