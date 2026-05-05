export const cycloneDxBasic = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  version: 1,
  components: [
    {
      type: "library",
      name: "lodash",
      version: "4.17.21",
      purl: "pkg:npm/lodash@4.17.21",
      homepage: "https://lodash.com",
      licenses: [{ license: { id: "MIT" } }],
      externalReferences: [
        { type: "vcs", url: "https://github.com/lodash/lodash" },
      ],
    },
    {
      type: "library",
      name: "react",
      version: "19.0.0",
      purl: "pkg:npm/react@19.0.0",
      licenses: [{ license: { id: "MIT" } }],
    },
  ],
};

export const cycloneDxWithExpression = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  components: [
    {
      type: "library",
      name: "dual-licensed-pkg",
      version: "1.0.0",
      licenses: [{ expression: "MIT OR Apache-2.0" }],
    },
  ],
};

export const cycloneDxWithModifications = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  components: [
    {
      type: "library",
      name: "patched-lib",
      version: "2.0.0",
      modified: true,
      pedigree: {
        patches: [{ type: "backport" }],
        notes: "Backported security patch",
      },
      licenses: [{ license: { id: "Apache-2.0" } }],
    },
  ],
};

export const cycloneDxNoLicense = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  components: [
    { type: "library", name: "mystery-lib", version: "0.1.0" },
  ],
};

export const cycloneDxWithCustomLicenseText = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  components: [
    {
      type: "library",
      name: "custom-lic",
      version: "1.0.0",
      licenses: [
        {
          license: {
            id: "MyCustom-1.0",
            name: "My Custom License",
            text: { content: "Permission is hereby granted..." },
          },
        },
      ],
    },
  ],
};

export const spdxBasic = {
  spdxVersion: "SPDX-2.3",
  dataLicense: "CC0-1.0",
  SPDXID: "SPDXRef-DOCUMENT",
  packages: [
    {
      name: "express",
      versionInfo: "4.18.2",
      licenseConcluded: "MIT",
      licenseDeclared: "MIT",
      copyrightText: "Copyright (c) 2009-2014 TJ Holowaychuk",
      downloadLocation: "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      homepage: "https://expressjs.com",
      externalRefs: [
        {
          referenceCategory: "PACKAGE-MANAGER",
          referenceType: "purl",
          referenceLocator: "pkg:npm/express@4.18.2",
        },
        {
          referenceCategory: "OTHER",
          referenceType: "vcs",
          url: "https://github.com/expressjs/express",
        },
      ],
    },
    {
      name: "lodash",
      versionInfo: "4.17.21",
      licenseConcluded: "MIT",
      copyrightText: "Copyright OpenJS Foundation and other contributors",
    },
  ],
};

export const spdxWithNoassertion = {
  spdxVersion: "SPDX-2.3",
  packages: [
    {
      name: "weird-pkg",
      versionInfo: "1.0.0",
      licenseConcluded: "NOASSERTION",
      licenseDeclared: "NONE",
    },
  ],
};

export const spdxWithLicenseInfoFromFiles = {
  spdxVersion: "SPDX-2.3",
  packages: [
    {
      name: "files-derived-pkg",
      versionInfo: "1.0.0",
      licenseConcluded: "NOASSERTION",
      licenseDeclared: "NOASSERTION",
      licenseInfoFromFiles: ["BSD-3-Clause"],
    },
  ],
};

export const spdxWithMixedLicenseInfoFromFiles = {
  spdxVersion: "SPDX-2.3",
  packages: [
    {
      name: "mixed-files-pkg",
      versionInfo: "1.0.0",
      licenseConcluded: "NOASSERTION",
      licenseDeclared: "NOASSERTION",
      licenseInfoFromFiles: ["NOASSERTION", "BSD-3-Clause"],
    },
  ],
};

export const spdxEmpty = {
  spdxVersion: "SPDX-2.3",
  packages: [],
};

export const garbage = {
  someField: "value",
  notAnSbom: true,
};
