export const games = {
  survie: {
    id: 'survie',
    dbId: 'SURVIE_COPAINS',
    name: 'La survie des copains'
  },
  cobblemon: {
    id: 'cobblemon',
    dbId: 'COBBLEMON',
    name: 'Cobblemon: New Era'
  },
  cobblemonLegacy: {
    id: 'cobblemonLegacy',
    dbId: 'COBBLEMON_LEGACY',
    name: 'Cobblemon: New Era (Legacy)'
  },
  staracademy: {
    id: 'staracademy',
    dbId: 'STAR_ACADEMY',
    name: 'Cobblemon: Star Academy New Era',
    startPoints: [
      {
        match: `<log4j:Message><![CDATA[SpongePowered MIXIN Subsystem Version=0.8.7 Source=`,
        progress: 5
      },
      {
        match: `<log4j:Message><![CDATA[Loaded configuration file for ModernFix `,
        progress: 10
      },
      {
        match: `<log4j:Message><![CDATA[Force-disabling mixin 'features.render.world.sky.FogRendererMixin' as rule 'mixin.features.render.world.sky' (added by mods [iris]) disables it and children]]></log4j:Message>`,
        progress: 15
      },
      {
        match: `<log4j:Message><![CDATA[{any} Datafixer optimizations took `,
        progress: 20
      },
      {
        match: `<log4j:Message><![CDATA[Injecting BlockStateBase cache population hook into isConditionallyFullOpaque from ca.spottedleaf.starlight.mixin.common.blockstate.BlockStateBaseMixin]]></log4j:Message>`,
        progress: 25
      },
      {
        match: `<log4j:Message><![CDATA[Static binding violation: PRIVATE @Overwrite method method_21740 in modernfix-common.mixins.json:perf.remove_biome_temperature_cache.BiomeMixin from mod modernfix cannot reduce visibiliy of PUBLIC target method, visibility will be upgraded.]]></log4j:Message>`,
        progress: 30
      },
      {
        match: `<log4j:Message><![CDATA[Method overwrite conflict for getScheduledRandomTicks in ohthetreesyoullgrow.mixins.json:chunk.MixinChunkAccess from mod ohthetreesyoullgrow, previously written by corgitaco.corgilib.mixin.chunk.MixinChunkAccess. Skipping method.]]></log4j:Message>`,
        progress: 35
      },
      {
        match: `<log4j:Message><![CDATA[Environment: Environment[sessionHost=https://sessionserver.mojang.com, servicesHost=https://api.minecraftservices.com, name=PROD]]]></log4j:Message>`,
        progress: 40
      },
      {
        match: `<log4j:Message><![CDATA[Loaded config for: cupboard.json]]></log4j:Message>`,
        progress: 45
      },
      {
        match: `<log4j:Message><![CDATA[[Regions Unexplored] generating and loading config]]></log4j:Message>`,
        progress: 50
      },
      {
        match: `<log4j:Message><![CDATA[Enabling Achievement Optimizer]]></log4j:Message>`,
        progress: 55
      },
      {
        match: `<log4j:Message><![CDATA[No data fixer registered for biomeswevegone:sign]]></log4j:Message>`,
        progress: 60
      },
      {
        match: `<log4j:Message><![CDATA[Note: Cobblemon data registries are only loaded once per server instance as Pokémon species are not safe to reload.]]></log4j:Message>`,
        progress: 65
      },
      {
        match: `<log4j:Message><![CDATA[Checking for config merge.]]></log4j:Message>`,
        progress: 70
      },
      {
        match: `<log4j:Message><![CDATA[Hello Display!]]></log4j:Message>`,
        progress: 80
      },
      {
        match: `<log4j:Message><![CDATA[[1;35m[[39m[1;95meverlasting[39m[1;35mutils[39m[1;35m][39m [90m- Test Registration: [39m[1;32mGOOD[39m]]></log4j:Message>`,
        progress: 85
      },
      {
        match: `<log4j:Message><![CDATA[Loading ParticleAnimationLib for awesome particle effects!]]></log4j:Message>`,
        progress: 90
      },
      {
        match: `<log4j:Message><![CDATA[Initialized color sets in `,
        progress: 95
      },
      {
        match: `<log4j:Message><![CDATA[ARB_direct_state_access detected, enabling DSA.]]></log4j:Message>`,
        progress: 100
      }
    ]
  }
}
