'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { organization, workspaces } from '@/lib/data/mock'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function WorkspaceSwitcher() {
  const [activeId, setActiveId] = useState(workspaces[0]?.id)
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg border bg-card px-3 py-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white"
          style={{ backgroundColor: active.color }}
        >
          {active.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{active.name}</p>
          <p className="truncate text-xs text-muted-foreground">{organization.plan} plan</p>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[15rem]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
        </DropdownMenuGroup>
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} onClick={() => setActiveId(w.id)} className="gap-2.5">
            <div
              className="flex size-6 items-center justify-center rounded-md text-[0.65rem] font-semibold text-white"
              style={{ backgroundColor: w.color }}
            >
              {w.name.charAt(0)}
            </div>
            <span className="flex-1 truncate">{w.name}</span>
            <Check className={cn('size-4', w.id === active.id ? 'opacity-100' : 'opacity-0')} />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2.5 text-muted-foreground">
          <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
            <Plus className="size-3.5" />
          </div>
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
