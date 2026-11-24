<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
}

const props = withDefaults(defineProps<{
  data: DataPoint[]
  title: string
  color?: string
  height?: number
}>(), {
  color: '#2563eb',
  height: 200,
})

const padPx = 10
const labelPad = 40

function svgAttrs(_w: number) {
  return {
    viewBox: `0 0 ${_w} ${props.height}`,
    preserveAspectRatio: 'none',
    class: 'w-full',
    style: { height: `${props.height}px` },
  }
}

function pathData(_w: number) {
  const pts = props.data
  if (!pts.length) return ''
  const chartW = _w - labelPad - padPx
  const chartH = props.height - padPx * 2
  const maxV = Math.max(...pts.map((p) => p.value), 1)
  const stepX = pts.length > 1 ? chartW / (pts.length - 1) : chartW / 2

  const points = pts.map((p, i) => ({
    x: labelPad + (pts.length > 1 ? i * stepX : chartW / 2),
    y: padPx + chartH - (p.value / maxV) * chartH,
  }))

  // Smooth cubic curve
  const first = points[0]!
  let d = `M ${first.x},${first.y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!
    const curr = points[i]!
    const cpx1 = prev.x + (curr.x - prev.x) * 0.3
    const cpy1 = prev.y
    const cpx2 = curr.x - (curr.x - prev.x) * 0.3
    const cpy2 = curr.y
    d += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr.x},${curr.y}`
  }
  return d
}

function areaPath(_w: number) {
  const pts = props.data
  if (!pts.length) return ''
  const line = pathData(_w)
  const lastX = labelPad + (pts.length > 1 ? (pts.length - 1) * ((_w - labelPad - padPx) / (pts.length - 1)) : (_w - labelPad - padPx) / 2)
  const chartH = props.height - padPx * 2
  return `${line} L ${lastX},${padPx + chartH} L ${labelPad},${padPx + chartH} Z`
}

function gridLines(_w: number) {
  const chartW = _w - labelPad - padPx
  const chartH = props.height - padPx * 2
  const lines = []
  for (let i = 0; i <= 3; i++) {
    const y = padPx + (chartH * i) / 3
    lines.push({
      y,
      x1: labelPad,
      x2: labelPad + chartW,
    })
  }
  return lines
}

function yLabels(_w: number) {
  const chartH = props.height - padPx * 2
  const maxV = Math.max(...props.data.map((p) => p.value), 1)
  const labels = []
  for (let i = 0; i <= 3; i++) {
    const val = Math.round((maxV * (3 - i)) / 3)
    labels.push({
      y: padPx + (chartH * i) / 3 + 4,
      text: val.toLocaleString('fa-IR'),
    })
  }
  return labels
}

function xLabels(_w: number) {
  const pts = props.data
  if (!pts.length) return []
  const indices = [0, Math.floor((pts.length - 1) / 2), pts.length - 1].filter(
    (i, idx, arr) => arr.indexOf(i) === idx
  )
  const stepX = pts.length > 1 ? (_w - labelPad - padPx) / (pts.length - 1) : (_w - labelPad - padPx) / 2
  return indices.map((i) => ({
    x: labelPad + (pts.length > 1 ? i * stepX : (_w - labelPad - padPx) / 2),
    y: props.height! - 4,
    text: pts[i]!.label,
  }))
}

function tooltipData(_w: number) {
  const pts = props.data
  if (!pts.length) return []
  const chartW = _w - labelPad - padPx
  const maxV = Math.max(...pts.map((p) => p.value), 1)
  const chartH = props.height - padPx * 2
  const stepX = pts.length > 1 ? chartW / (pts.length - 1) : chartW / 2
  return pts.map((p, i) => ({
    x: labelPad + (pts.length > 1 ? i * stepX : chartW / 2),
    y: padPx + chartH - (p.value / maxV) * chartH,
    value: p.value.toLocaleString('fa-IR'),
    label: p.label,
  }))
}

// Use a ref for responsive width
const svgRef = ref<HTMLElement | null>(null)
const width = ref(600)

function updateWidth() {
  if (svgRef.value?.parentElement) {
    width.value = svgRef.value.parentElement.clientWidth || 600
  }
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const w = computed(() => Math.max(width.value, 300))
</script>

<template>
  <div class="relative" ref="svgRef">
    <h4 class="mb-2 text-sm font-semibold opacity-70">{{ title }}</h4>
    <svg v-bind="svgAttrs(w)" class="w-full overflow-visible">
      <!-- Grid lines -->
      <line
        v-for="(g, i) in gridLines(w)"
        :key="'g' + i"
        :x1="g.x1"
        :y1="g.y"
        :x2="g.x2"
        :y2="g.y"
        stroke="currentColor"
        stroke-opacity="0.1"
        stroke-dasharray="4,4"
      />
      <!-- Area fill -->
      <path
        v-if="data.length > 1"
        :d="areaPath(w)"
        :fill="color"
        fill-opacity="0.08"
      />
      <!-- Line -->
      <path
        v-if="data.length > 1"
        :d="pathData(w)"
        :stroke="color"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Y labels -->
      <text
        v-for="(l, i) in yLabels(w)"
        :key="'yl' + i"
        :x="labelPad - 6"
        :y="l.y"
        text-anchor="end"
        font-size="10"
        fill="currentColor"
        fill-opacity="0.5"
      >{{ l.text }}</text>
      <!-- X labels -->
      <text
        v-for="(l, i) in xLabels(w)"
        :key="'xl' + i"
        :x="l.x"
        :y="l.y"
        text-anchor="middle"
        font-size="10"
        fill="currentColor"
        fill-opacity="0.5"
      >{{ l.text }}</text>
      <!-- Dots with tooltip regions (invisible hit areas) -->
      <g v-for="(t, i) in tooltipData(w)" :key="'dot' + i" class="group">
        <circle :cx="t.x" :cy="t.y" r="4" :fill="color" class="opacity-0 group-hover:opacity-100 transition-opacity" />
        <rect
          :x="t.x - 30"
          :y="t.y - 24"
          width="60"
          height="20"
          rx="4"
          fill="#1f2937"
          class="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        />
        <text
          :x="t.x"
          :y="t.y - 10"
          text-anchor="middle"
          font-size="10"
          fill="white"
          class="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {{ t.label }}: {{ t.value }}
        </text>
        <!-- Invisible wider hit area -->
        <rect
          :x="t.x - 15"
          :y="0"
          width="30"
          :height="props.height"
          fill="transparent"
          class="cursor-pointer"
        />
      </g>
      <!-- Fallback for single point -->
      <circle
        v-if="data.length === 1"
        :cx="labelPad + (w - labelPad - padPx) / 2"
        :cy="padPx"
        r="4"
        :fill="color"
      />
    </svg>
    <div v-if="!data.length" class="flex justify-center py-6 text-sm opacity-50">
      داده‌ای برای نمایش وجود ندارد
    </div>
  </div>
</template>